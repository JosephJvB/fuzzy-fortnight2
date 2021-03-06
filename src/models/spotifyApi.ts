export interface ISpotifyTrack {
  album: ISpotifyAlbum
  artists: ISpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

export interface IFollowers {
  href: string
  total: number
}
export interface ISpotifyImage {
  height: number
  url: string
  width: number
}
export interface ISpotifyArtist {
  followers: IFollowers
  genres: string[]
  href: string
  id: string
  images: ISpotifyImage[]
  name: string
  popularity: number
  type: string
  uri: string
}

export enum SpotifyTopItems {
  tracks = 'tracks',
  artists = 'artists',
}
export enum SpotifyTopRange {
  shortTerm = 'short_term',
  mediumTerm = 'medium_term',
  longTerm = 'long_term',
}

export interface ISpotifyAlbum {
  album_type: string
  artists: ISpotifyArtist[]
  images: ISpotifyImage[]
  name: string
  release_date: string
  available_markets: string[]
}