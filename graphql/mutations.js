/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTrack = /* GraphQL */ `
  mutation CreateTrack(
    $input: CreateTrackInput!
    $condition: ModelTrackConditionInput
  ) {
    createTrack(input: $input, condition: $condition) {
      id
      name
      color
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTrack = /* GraphQL */ `
  mutation UpdateTrack(
    $input: UpdateTrackInput!
    $condition: ModelTrackConditionInput
  ) {
    updateTrack(input: $input, condition: $condition) {
      id
      name
      color
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTrack = /* GraphQL */ `
  mutation DeleteTrack(
    $input: DeleteTrackInput!
    $condition: ModelTrackConditionInput
  ) {
    deleteTrack(input: $input, condition: $condition) {
      id
      name
      color
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
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
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
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
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
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
export const createSection = /* GraphQL */ `
  mutation CreateSection(
    $input: CreateSectionInput!
    $condition: ModelSectionConditionInput
  ) {
    createSection(input: $input, condition: $condition) {
      id
      name
      Track
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateSection = /* GraphQL */ `
  mutation UpdateSection(
    $input: UpdateSectionInput!
    $condition: ModelSectionConditionInput
  ) {
    updateSection(input: $input, condition: $condition) {
      id
      name
      Track
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteSection = /* GraphQL */ `
  mutation DeleteSection(
    $input: DeleteSectionInput!
    $condition: ModelSectionConditionInput
  ) {
    deleteSection(input: $input, condition: $condition) {
      id
      name
      Track
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createProgress = /* GraphQL */ `
  mutation CreateProgress(
    $input: CreateProgressInput!
    $condition: ModelProgressConditionInput
  ) {
    createProgress(input: $input, condition: $condition) {
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
export const updateProgress = /* GraphQL */ `
  mutation UpdateProgress(
    $input: UpdateProgressInput!
    $condition: ModelProgressConditionInput
  ) {
    updateProgress(input: $input, condition: $condition) {
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
export const deleteProgress = /* GraphQL */ `
  mutation DeleteProgress(
    $input: DeleteProgressInput!
    $condition: ModelProgressConditionInput
  ) {
    deleteProgress(input: $input, condition: $condition) {
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
export const createStagelist = /* GraphQL */ `
  mutation CreateStagelist(
    $input: CreateStagelistInput!
    $condition: ModelStagelistConditionInput
  ) {
    createStagelist(input: $input, condition: $condition) {
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
export const updateStagelist = /* GraphQL */ `
  mutation UpdateStagelist(
    $input: UpdateStagelistInput!
    $condition: ModelStagelistConditionInput
  ) {
    updateStagelist(input: $input, condition: $condition) {
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
export const deleteStagelist = /* GraphQL */ `
  mutation DeleteStagelist(
    $input: DeleteStagelistInput!
    $condition: ModelStagelistConditionInput
  ) {
    deleteStagelist(input: $input, condition: $condition) {
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
export const createStage = /* GraphQL */ `
  mutation CreateStage(
    $input: CreateStageInput!
    $condition: ModelStageConditionInput
  ) {
    createStage(input: $input, condition: $condition) {
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
export const updateStage = /* GraphQL */ `
  mutation UpdateStage(
    $input: UpdateStageInput!
    $condition: ModelStageConditionInput
  ) {
    updateStage(input: $input, condition: $condition) {
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
export const deleteStage = /* GraphQL */ `
  mutation DeleteStage(
    $input: DeleteStageInput!
    $condition: ModelStageConditionInput
  ) {
    deleteStage(input: $input, condition: $condition) {
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
export const createLog = /* GraphQL */ `
  mutation CreateLog(
    $input: CreateLogInput!
    $condition: ModelLogConditionInput
  ) {
    createLog(input: $input, condition: $condition) {
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
export const updateLog = /* GraphQL */ `
  mutation UpdateLog(
    $input: UpdateLogInput!
    $condition: ModelLogConditionInput
  ) {
    updateLog(input: $input, condition: $condition) {
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
export const deleteLog = /* GraphQL */ `
  mutation DeleteLog(
    $input: DeleteLogInput!
    $condition: ModelLogConditionInput
  ) {
    deleteLog(input: $input, condition: $condition) {
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
export const createSetting = /* GraphQL */ `
  mutation CreateSetting(
    $input: CreateSettingInput!
    $condition: ModelSettingConditionInput
  ) {
    createSetting(input: $input, condition: $condition) {
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
export const updateSetting = /* GraphQL */ `
  mutation UpdateSetting(
    $input: UpdateSettingInput!
    $condition: ModelSettingConditionInput
  ) {
    updateSetting(input: $input, condition: $condition) {
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
export const deleteSetting = /* GraphQL */ `
  mutation DeleteSetting(
    $input: DeleteSettingInput!
    $condition: ModelSettingConditionInput
  ) {
    deleteSetting(input: $input, condition: $condition) {
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
