using System.Text.Json;
using Microsoft.Data.SqlClient;
using GuessX.Server.Application.Exceptions;

namespace GuessX.Server.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            var (statusCode, errorCode, message) = MapException(exception);

            _logger.LogError(
                exception,
                "Request failed. TraceId: {TraceId}, StatusCode: {StatusCode}, ErrorCode: {ErrorCode}",
                context.TraceIdentifier,
                statusCode,
                errorCode);

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var response = new 
            {
                StatusCode = statusCode,
                Message = "Internal Server Error from the custom middleware.",
                Detailed = message 
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }

    private static (int StatusCode, string ErrorCode, string Message) MapException(Exception exception)
    {
        return exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "NOT_FOUND", exception.Message),
            ArgumentException => (StatusCodes.Status400BadRequest, "BAD_REQUEST", exception.Message),
            HttpRequestException => (StatusCodes.Status502BadGateway, "UPSTREAM_SERVICE_ERROR", "Upstream service request failed."),
            JsonException => (StatusCodes.Status502BadGateway, "UPSTREAM_PAYLOAD_ERROR", "Upstream service returned invalid payload."),
            ExternalServiceException => (StatusCodes.Status502BadGateway, "UPSTREAM_SERVICE_ERROR", exception.Message),
            InvalidOperationException => (StatusCodes.Status409Conflict, "CONFLICT", exception.Message),
            SqlException => (StatusCodes.Status503ServiceUnavailable, "DATABASE_UNAVAILABLE", "Database connection failed. Check SQL Server connection settings and credentials."),
            _ => (StatusCodes.Status500InternalServerError, "INTERNAL_SERVER_ERROR", "An unexpected error occurred."),
        };
    }
}
