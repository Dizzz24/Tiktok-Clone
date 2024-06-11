import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
    mutation Login($input: InputLogin) {
  login(input: $input) {
    access_token
  }
}
`

export const REGISTER_MUTATION = gql`
mutation AddUser($input: InputRegister) {
  addUser(input: $input) {
    _id
    name
    username
    email
  }
}
`

export const COMMENT_MUTATION = gql`
mutation CommentPost($content: String!, $postId: ID) {
  commentPost(content: $content, postId: $postId) {
    message
  }
}
`

export const ADDPOST_MUTATION = gql`
mutation AddPost($input: InputPost) {
  addPost(input: $input) {
    message
  }
}
`

export const FOLLOW_MUTATION = gql`
mutation FollowUser($followingId: ID) {
  followUser(followingId: $followingId) {
    message
  }
}
`

export const LIKE_MUTATION = gql`
mutation LikePost($postId: ID) {
  likePost(postId: $postId) {
    message
  }
}
`