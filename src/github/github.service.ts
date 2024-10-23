import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  private octokit: Octokit;
  private readonly owner: string;
  private readonly repo: string;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    this.octokit = new Octokit({ auth: token });
    this.owner = this.configService.get<string>('GITHUB_OWNER');
    this.repo = this.configService.get<string>('GITHUB_REPO');
  }

  async uploadImage(imageBuffer: Buffer, filename: string): Promise<string> {
    try {
      const response = await this.octokit.rest.repos.createOrUpdateFileContents(
        {
          owner: this.owner,
          repo: this.repo,
          path: `proof-images/${filename}`,
          message: 'Add connection proof image',
          content: imageBuffer.toString('base64'),
          branch: 'main',
        },
      );

      // Github의 raw content URL 형식으로 반환
      return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/proof-images/${filename}`;
    } catch (error) {
      throw new Error(`Failed to upload image to Github: ${error.message}`);
    }
  }
}
