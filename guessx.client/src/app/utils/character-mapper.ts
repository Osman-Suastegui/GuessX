import { Character, CharacterLeagueOfLegends } from '../home-page-multi-games/interfaces';

/**
 * Maps API response data to the CharacterLeagueOfLegends interface.
 * @param apiResponse The raw API response.
 * @returns A mapped CharacterLeagueOfLegends object.
 */
export function mapApiResponseToCharacter(apiResponse: Character): CharacterLeagueOfLegends {
  const metadata = JSON.parse(apiResponse.metadata || '');

  const championName: string = apiResponse.name.replace(' ', '').replace("'", '');
  const imageUrl: string = `https://ddragon.leagueoflegends.com/cdn/16.7.1/img/champion/${championName}.png`;

  return {
    id: apiResponse.id,
    name: apiResponse.name,
    gender: metadata.gender || 'Unknown',
    role: metadata.role || 'Unknown',
    position: metadata.position || 'Unknown',
    class: metadata.class || 'Unknown',
    resource: metadata.resource?.toLowerCase()?.includes('manaless') ? 'Manaless' : metadata.resource || 'Unknown',
    rangeType: metadata.range_type || 'Unknown',
    releaseYear: new Date(metadata.release_date).getFullYear(),
    imageUrl: imageUrl,
  };
}
