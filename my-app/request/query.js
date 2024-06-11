import { gql } from "@apollo/client";

export const GET_POSTS = gql`
   query GetPosts {
  getPosts {
    _id
    content
    tags
    imgUrl
    Comments {
      content
      username
    }
    Likes {
      username
    }
    Author {
      _id
      name
      username
    }
    updatedAt
  }
}
`

export const GET_COMMENT = gql`
  query getPostById($postId: ID) {
    getPostById(postId: $postId) {
      Comments {
        content
        username
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
   query getPostById($userId: ID)  {
    getUserById(userId: $userId) {
      _id
      name
      username
      email
      Posts {
        _id
        imgUrl
        Likes {
          username
        }
      }
      followers
      following
    }
  }
`;

export const GETUSER_BY_NAME_UNAME = gql`
   query GetUserByNameOrUname($nameOrUname: String) {
  getUserByNameOrUname(nameOrUname: $nameOrUname) {
    _id
    name
    username
    email
  }
}
`