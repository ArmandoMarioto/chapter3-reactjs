import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";

import { query as q } from "faunadb"

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  jwt:{
    secret: process.env.JWT_SECRET,
  },

  callbacks: {
    async signIn(user, account, profile) {
      
      const email = user.user.email;
      try {
        await fauna.query(
          q.Create(
            q.Collection("users"),
            {data: {email}}
          )
        )
        return true;
      } catch (error) {

        return false;
      }
     
    } 
  }



})