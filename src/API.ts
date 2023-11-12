/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateReviewInput = {
  id?: string | null,
  pid: string,
  uid: string,
  title: string,
  description?: string | null,
  video: string,
};

export type ModelReviewConditionInput = {
  pid?: ModelStringInput | null,
  uid?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  video?: ModelStringInput | null,
  and?: Array< ModelReviewConditionInput | null > | null,
  or?: Array< ModelReviewConditionInput | null > | null,
  not?: ModelReviewConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Review = {
  __typename: "Review",
  id: string,
  pid: string,
  uid: string,
  title: string,
  description?: string | null,
  video: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateReviewInput = {
  id: string,
  pid?: string | null,
  uid?: string | null,
  title?: string | null,
  description?: string | null,
  video?: string | null,
};

export type DeleteReviewInput = {
  id: string,
};

export type ModelReviewFilterInput = {
  id?: ModelIDInput | null,
  pid?: ModelStringInput | null,
  uid?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  video?: ModelStringInput | null,
  and?: Array< ModelReviewFilterInput | null > | null,
  or?: Array< ModelReviewFilterInput | null > | null,
  not?: ModelReviewFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelReviewConnection = {
  __typename: "ModelReviewConnection",
  items:  Array<Review | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionReviewFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  pid?: ModelSubscriptionStringInput | null,
  uid?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  video?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  or?: Array< ModelSubscriptionReviewFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type CreateReviewMutationVariables = {
  input: CreateReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type CreateReviewMutation = {
  createReview?:  {
    __typename: "Review",
    id: string,
    pid: string,
    uid: string,
    title: string,
    description?: string | null,
    video: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateReviewMutationVariables = {
  input: UpdateReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type UpdateReviewMutation = {
  updateReview?:  {
    __typename: "Review",
    id: string,
    pid: string,
    uid: string,
    title: string,
    description?: string | null,
    video: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteReviewMutationVariables = {
  input: DeleteReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type DeleteReviewMutation = {
  deleteReview?:  {
    __typename: "Review",
    id: string,
    pid: string,
    uid: string,
    title: string,
    description?: string | null,
    video: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetReviewQueryVariables = {
  id: string,
};

export type GetReviewQuery = {
  getReview?:  {
    __typename: "Review",
    id: string,
    pid: string,
    uid: string,
    title: string,
    description?: string | null,
    video: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListReviewsQueryVariables = {
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReviewsQuery = {
  listReviews?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      id: string,
      pid: string,
      uid: string,
      title: string,
      description?: string | null,
      video: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
};

export type OnCreateReviewSubscription = {
  onCreateReview?:  {
    __typename: "Review",
    id: string,
    pid: string,
    uid: string,
    title: string,
    description?: string | null,
    video: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
};

export type OnUpdateReviewSubscription = {
  onUpdateReview?:  {
    __typename: "Review",
    id: string,
    pid: string,
    uid: string,
    title: string,
    description?: string | null,
    video: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
};

export type OnDeleteReviewSubscription = {
  onDeleteReview?:  {
    __typename: "Review",
    id: string,
    pid: string,
    uid: string,
    title: string,
    description?: string | null,
    video: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
