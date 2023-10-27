/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTrack = /* GraphQL */ `
  query GetTrack($id: ID!) {
    getTrack(id: $id) {
      id
      name
      color
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTracks = /* GraphQL */ `
  query ListTracks(
    $filter: ModelTrackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTracks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        color
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      task
      year
      month
      day
      state
      recurring
      monthly
      track
      section
      time
      creation
      completion
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        task
        year
        month
        day
        state
        recurring
        monthly
        track
        section
        time
        creation
        completion
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSection = /* GraphQL */ `
  query GetSection($id: ID!) {
    getSection(id: $id) {
      id
      name
      Track
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listSections = /* GraphQL */ `
  query ListSections(
    $filter: ModelSectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSections(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        Track
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getProgress = /* GraphQL */ `
  query GetProgress($id: ID!) {
    getProgress(id: $id) {
      id
      name
      track
      section
      progress
      rate
      year
      month
      day
      creation
      completion
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listProgresses = /* GraphQL */ `
  query ListProgresses(
    $filter: ModelProgressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProgresses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        track
        section
        progress
        rate
        year
        month
        day
        creation
        completion
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStagelist = /* GraphQL */ `
  query GetStagelist($id: ID!) {
    getStagelist(id: $id) {
      id
      name
      item
      color
      order
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStagelists = /* GraphQL */ `
  query ListStagelists(
    $filter: ModelStagelistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStagelists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        item
        color
        order
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStage = /* GraphQL */ `
  query GetStage($id: ID!) {
    getStage(id: $id) {
      id
      name
      track
      section
      list
      stage
      archive
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStages = /* GraphQL */ `
  query ListStages(
    $filter: ModelStageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        track
        section
        list
        stage
        archive
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLog = /* GraphQL */ `
  query GetLog($id: ID!) {
    getLog(id: $id) {
      id
      year
      month
      day
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLogs = /* GraphQL */ `
  query ListLogs(
    $filter: ModelLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        year
        month
        day
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSetting = /* GraphQL */ `
  query GetSetting($id: ID!) {
    getSetting(id: $id) {
      id
      highlight
      postpone
      started
      notifications
      expirytime
      weekstart
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listSettings = /* GraphQL */ `
  query ListSettings(
    $filter: ModelSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSettings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        highlight
        postpone
        started
        notifications
        expirytime
        weekstart
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
