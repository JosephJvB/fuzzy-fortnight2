import HttpClient from "../clients/httpClient"
import { JafToken } from "../config"
import { ISpotifyArtist, ISpotifyTrack, SpotifyTopItems, SpotifyTopRange } from "../models/spotifyApi"

export default class SpotifyService {
  http: HttpClient
  topTracksMap: {
    [key: string]: ISpotifyTrack[]
  } = {}
  topArtistsMap: {
    [key: string]: ISpotifyArtist[]
  } = {}
  constructor(http: HttpClient) {
    this.http = http
  }
  async getTopItems(type: SpotifyTopItems, range: SpotifyTopRange): Promise<void> {
    const { token, items } = await this.http.getTopItems({
      token: localStorage.getItem(JafToken)!,
      type,
      range
    })
    localStorage.setItem(JafToken, token)
    switch (type) {
      case SpotifyTopItems.artists:
        this.topArtistsMap[range] = items as ISpotifyArtist[]
        break
      case SpotifyTopItems.tracks:
        this.topTracksMap[range] = items as ISpotifyTrack[]
        break
    }
  }
}
