/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTrack = /* GraphQL */ `
  subscription OnCreateTrack($filter: ModelSubscriptionTrackFilterInput) {
    onCreateTrack(filter: $filter) {
      id
      name
      color
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTrack = /* GraphQL */ `
  subscription OnUpdateTrack($filter: ModelSubscriptionTrackFilterInput) {
    onUpdateTrack(filter: $filter) {
      id
      name
      color
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTrack = /* GraphQL */ `
  subscription OnDeleteTrack($filter: ModelSubscriptionTrackFilterInput) {
    onDeleteTrack(filter: $filter) {
      id
      name
      color
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
    onCreateTask(filter: $filter) {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
    onUpdateTask(filter: $filter) {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
    onDeleteTask(filter: $filter) {
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
export const onCreateSection = /* GraphQL */ `
  subscription OnCreateSection($filter: ModelSubscriptionSectionFilterInput) {
    onCreateSection(filter: $filter) {
      id
      name
      Track
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateSection = /* GraphQL */ `
  subscription OnUpdateSection($filter: ModelSubscriptionSectionFilterInput) {
    onUpdateSection(filter: $filter) {
      id
      name
      Track
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteSection = /* GraphQL */ `
  subscription OnDeleteSection($filter: ModelSubscriptionSectionFilterInput) {
    onDeleteSection(filter: $filter) {
      id
      name
      Track
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateProgress = /* GraphQL */ `
  subscription OnCreateProgress($filter: ModelSubscriptionProgressFilterInput) {
    onCreateProgress(filter: $filter) {
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
export const onUpdateProgress = /* GraphQL */ `
  subscription OnUpdateProgress($filter: ModelSubscriptionProgressFilterInput) {
    onUpdateProgress(filter: $filter) {
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
export const onDeleteProgress = /* GraphQL */ `
  subscription OnDeleteProgress($filter: ModelSubscriptionProgressFilterInput) {
    onDeleteProgress(filter: $filter) {
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
export const onCreateStagelist = /* GraphQL */ `
  subscription OnCreateStagelist(
    $filter: ModelSubscriptionStagelistFilterInput
  ) {
    onCreateStagelist(filter: $filter) {
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
export const onUpdateStagelist = /* GraphQL */ `
  subscription OnUpdateStagelist(
    $filter: ModelSubscriptionStagelistFilterInput
  ) {
    onUpdateStagelist(filter: $filter) {
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
export const onDeleteStagelist = /* GraphQL */ `
  subscription OnDeleteStagelist(
    $filter: ModelSubscriptionStagelistFilterInput
  ) {
    onDeleteStagelist(filter: $filter) {
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
export const onCreateStage = /* GraphQL */ `
  subscription OnCreateStage($filter: ModelSubscriptionStageFilterInput) {
    onCreateStage(filter: $filter) {
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
export const onUpdateStage = /* GraphQL */ `
  subscription OnUpdateStage($filter: ModelSubscriptionStageFilterInput) {
    onUpdateStage(filter: $filter) {
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
export const onDeleteStage = /* GraphQL */ `
  subscription OnDeleteStage($filter: ModelSubscriptionStageFilterInput) {
    onDeleteStage(filter: $filter) {
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
export const onCreateLog = /* GraphQL */ `
  subscription OnCreateLog($filter: ModelSubscriptionLogFilterInput) {
    onCreateLog(filter: $filter) {
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
export const onUpdateLog = /* GraphQL */ `
  subscription OnUpdateLog($filter: ModelSubscriptionLogFilterInput) {
    onUpdateLog(filter: $filter) {
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
export const onDeleteLog = /* GraphQL */ `
  subscription OnDeleteLog($filter: ModelSubscriptionLogFilterInput) {
    onDeleteLog(filter: $filter) {
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
export const onCreateSetting = /* GraphQL */ `
  subscription OnCreateSetting($filter: ModelSubscriptionSettingFilterInput) {
    onCreateSetting(filter: $filter) {
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
export const onUpdateSetting = /* GraphQL */ `
  subscription OnUpdateSetting($filter: ModelSubscriptionSettingFilterInput) {
    onUpdateSetting(filter: $filter) {
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
export const onDeleteSetting = /* GraphQL */ `
  subscription OnDeleteSetting($filter: ModelSubscriptionSettingFilterInput) {
    onDeleteSetting(filter: $filter) {
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
