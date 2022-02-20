declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    EMAIL_SERVER: string;
    EMAIL_FROM: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    DISCORD_ID: string;
    DISCORD_SECRET: string;
    TWITTER_ID: string;
    TWITTER_SECRET: string;
  }
}
