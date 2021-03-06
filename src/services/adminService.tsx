import HttpClient from "../clients/httpClient";
import { AdminSpotifyId, JafToken } from "../config";
import { QuizType } from "../models/quiz";
import { IUser } from "../models/user";

export default class AdminService {
  http: HttpClient
  constructor(http: HttpClient) {
    this.http = http
  }

  async generateQuiz(userIds: string[]) {
     await this.http.generateQuiz({
       token: localStorage.getItem(JafToken)!,
       quizType: QuizType.track,
       userIds,
     })
  }

  async loadUsers(spotifyId: string): Promise<IUser[]> {
    const { token, message, users } = await this.http.loadUsers({
      token: localStorage.getItem(JafToken)!,
      spotifyId,
    })
    localStorage.setItem(JafToken, token)
    return users
  }
}