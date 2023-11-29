export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Duration: { input: number; output: number };
  Map: { input: any; output: any };
  StringMap: { input: { [key: string]: any }; output: { [key: string]: any } };
  Time: { input: Date; output: Date };
};

export type AwsConfig = {
  __typename?: "AWSConfig";
  maxVolumeSizePerUser?: Maybe<Scalars["Int"]["output"]>;
  pod?: Maybe<AwsPodConfig>;
};

export type AwsPodConfig = {
  __typename?: "AWSPodConfig";
  ecs?: Maybe<EcsConfig>;
};

export type AbortInfo = {
  __typename?: "AbortInfo";
  buildVariantDisplayName: Scalars["String"]["output"];
  newVersion: Scalars["String"]["output"];
  prClosed: Scalars["Boolean"]["output"];
  taskDisplayName: Scalars["String"]["output"];
  taskID: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

/**
 * Annotation models the metadata that a user can add to a task.
 * It is used as a field within the Task type.
 */
export type Annotation = {
  __typename?: "Annotation";
  createdIssues?: Maybe<Array<Maybe<IssueLink>>>;
  id: Scalars["String"]["output"];
  issues?: Maybe<Array<Maybe<IssueLink>>>;
  metadataLinks?: Maybe<Array<Maybe<MetadataLink>>>;
  note?: Maybe<Note>;
  suspectedIssues?: Maybe<Array<Maybe<IssueLink>>>;
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
  webhookConfigured: Scalars["Boolean"]["output"];
};

export enum Arch {
  Linux_64Bit = "LINUX_64_BIT",
  LinuxArm_64Bit = "LINUX_ARM_64_BIT",
  LinuxPpc_64Bit = "LINUX_PPC_64_BIT",
  LinuxZseries = "LINUX_ZSERIES",
  Osx_64Bit = "OSX_64_BIT",
  OsxArm_64Bit = "OSX_ARM_64_BIT",
  Windows_64Bit = "WINDOWS_64_BIT",
}

export enum BannerTheme {
  Announcement = "ANNOUNCEMENT",
  Important = "IMPORTANT",
  Information = "INFORMATION",
  Warning = "WARNING",
}

export enum BootstrapMethod {
  LegacySsh = "LEGACY_SSH",
  Ssh = "SSH",
  UserData = "USER_DATA",
}

export type BootstrapSettings = {
  __typename?: "BootstrapSettings";
  clientDir: Scalars["String"]["output"];
  communication: CommunicationMethod;
  env: Array<EnvVar>;
  jasperBinaryDir: Scalars["String"]["output"];
  jasperCredentialsPath: Scalars["String"]["output"];
  method: BootstrapMethod;
  preconditionScripts: Array<PreconditionScript>;
  resourceLimits: ResourceLimits;
  rootDir: Scalars["String"]["output"];
  serviceUser: Scalars["String"]["output"];
  shellPath: Scalars["String"]["output"];
};

export type BootstrapSettingsInput = {
  clientDir: Scalars["String"]["input"];
  communication: CommunicationMethod;
  env: Array<EnvVarInput>;
  jasperBinaryDir: Scalars["String"]["input"];
  jasperCredentialsPath: Scalars["String"]["input"];
  method: BootstrapMethod;
  preconditionScripts: Array<PreconditionScriptInput>;
  resourceLimits: ResourceLimitsInput;
  rootDir: Scalars["String"]["input"];
  serviceUser: Scalars["String"]["input"];
  shellPath: Scalars["String"]["input"];
};

export type Build = {
  __typename?: "Build";
  actualMakespan: Scalars["Duration"]["output"];
  buildVariant: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  predictedMakespan: Scalars["Duration"]["output"];
  status: Scalars["String"]["output"];
};

/**
 * Build Baron is a service that can be integrated into a project (see Confluence Wiki for more details).
 * This type is returned from the buildBaron query, and contains information about Build Baron configurations and suggested
 * tickets from JIRA for a given task on a given execution.
 */
export type BuildBaron = {
  __typename?: "BuildBaron";
  bbTicketCreationDefined: Scalars["Boolean"]["output"];
  buildBaronConfigured: Scalars["Boolean"]["output"];
  searchReturnInfo?: Maybe<SearchReturnInfo>;
};

export type BuildBaronSettings = {
  __typename?: "BuildBaronSettings";
  bfSuggestionFeaturesURL?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionPassword?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionServer?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionTimeoutSecs?: Maybe<Scalars["Int"]["output"]>;
  bfSuggestionUsername?: Maybe<Scalars["String"]["output"]>;
  ticketCreateIssueType: Scalars["String"]["output"];
  ticketCreateProject: Scalars["String"]["output"];
  ticketSearchProjects?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type BuildBaronSettingsInput = {
  bfSuggestionFeaturesURL?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionPassword?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionServer?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionTimeoutSecs?: InputMaybe<Scalars["Int"]["input"]>;
  bfSuggestionUsername?: InputMaybe<Scalars["String"]["input"]>;
  ticketCreateIssueType?: InputMaybe<Scalars["String"]["input"]>;
  ticketCreateProject: Scalars["String"]["input"];
  ticketSearchProjects?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/**
 * BuildVariantOptions is an input to the mainlineCommits query.
 * It stores values for statuses, tasks, and variants which are used to filter for matching versions.
 */
export type BuildVariantOptions = {
  includeBaseTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tasks?: InputMaybe<Array<Scalars["String"]["input"]>>;
  variants?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type BuildVariantTuple = {
  __typename?: "BuildVariantTuple";
  buildVariant: Scalars["String"]["output"];
  displayName: Scalars["String"]["output"];
};

export type ChildPatchAlias = {
  __typename?: "ChildPatchAlias";
  alias: Scalars["String"]["output"];
  patchId: Scalars["String"]["output"];
};

export type ClientBinary = {
  __typename?: "ClientBinary";
  arch?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  os?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

/**
 * ClientConfig stores information about the binaries for the Evergreen Command-Line Client that are available for
 * download on Evergreen.
 */
export type ClientConfig = {
  __typename?: "ClientConfig";
  clientBinaries?: Maybe<Array<ClientBinary>>;
  latestRevision?: Maybe<Scalars["String"]["output"]>;
};

export enum CloneMethod {
  LegacySsh = "LEGACY_SSH",
  Oauth = "OAUTH",
}

export type CloudProviderConfig = {
  __typename?: "CloudProviderConfig";
  aws?: Maybe<AwsConfig>;
};

/**
 * CommitQueue is returned by the commitQueue query.
 * It contains information about the patches on the commit queue (e.g. author, code changes) for a given project.
 */
export type CommitQueue = {
  __typename?: "CommitQueue";
  message?: Maybe<Scalars["String"]["output"]>;
  owner?: Maybe<Scalars["String"]["output"]>;
  projectId?: Maybe<Scalars["String"]["output"]>;
  queue?: Maybe<Array<CommitQueueItem>>;
  repo?: Maybe<Scalars["String"]["output"]>;
};

export type CommitQueueItem = {
  __typename?: "CommitQueueItem";
  enqueueTime?: Maybe<Scalars["Time"]["output"]>;
  issue?: Maybe<Scalars["String"]["output"]>;
  modules?: Maybe<Array<Module>>;
  patch?: Maybe<Patch>;
  source?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["String"]["output"]>;
};

export type CommitQueueParams = {
  __typename?: "CommitQueueParams";
  enabled?: Maybe<Scalars["Boolean"]["output"]>;
  mergeMethod: Scalars["String"]["output"];
  mergeQueue: MergeQueue;
  message: Scalars["String"]["output"];
};

export type CommitQueueParamsInput = {
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  mergeMethod?: InputMaybe<Scalars["String"]["input"]>;
  mergeQueue?: InputMaybe<MergeQueue>;
  message?: InputMaybe<Scalars["String"]["input"]>;
};

export enum CommunicationMethod {
  LegacySsh = "LEGACY_SSH",
  Rpc = "RPC",
  Ssh = "SSH",
}

export type ContainerPool = {
  __typename?: "ContainerPool";
  distro: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  maxContainers: Scalars["Int"]["output"];
  port: Scalars["Int"]["output"];
};

export type ContainerPoolsConfig = {
  __typename?: "ContainerPoolsConfig";
  pools: Array<ContainerPool>;
};

export type ContainerResources = {
  __typename?: "ContainerResources";
  cpu: Scalars["Int"]["output"];
  memoryMb: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

export type ContainerResourcesInput = {
  cpu: Scalars["Int"]["input"];
  memoryMb: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
};

/**
 * CopyDistroInput is the input to the copyDistro mutation.
 * It contains information about a distro to be duplicated.
 */
export type CopyDistroInput = {
  distroIdToCopy: Scalars["String"]["input"];
  newDistroId: Scalars["String"]["input"];
};

/**
 * CopyProjectInput is the input to the copyProject mutation.
 * It contains information about a project to be duplicated.
 */
export type CopyProjectInput = {
  newProjectId?: InputMaybe<Scalars["String"]["input"]>;
  newProjectIdentifier: Scalars["String"]["input"];
  projectIdToCopy: Scalars["String"]["input"];
};

/** CreateDistroInput is the input to the createDistro mutation. */
export type CreateDistroInput = {
  newDistroId: Scalars["String"]["input"];
};

/**
 * CreateProjectInput is the input to the createProject mutation.
 * It contains information about a new project to be created.
 */
export type CreateProjectInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  identifier: Scalars["String"]["input"];
  owner: Scalars["String"]["input"];
  repo: Scalars["String"]["input"];
  repoRefId?: InputMaybe<Scalars["String"]["input"]>;
};

/** DeleteDistroInput is the input to the deleteDistro mutation. */
export type DeleteDistroInput = {
  distroId: Scalars["String"]["input"];
};

/** Return type representing whether a distro was deleted. */
export type DeleteDistroPayload = {
  __typename?: "DeleteDistroPayload";
  deletedDistroId: Scalars["String"]["output"];
};

export type Dependency = {
  __typename?: "Dependency";
  buildVariant: Scalars["String"]["output"];
  metStatus: MetStatus;
  name: Scalars["String"]["output"];
  requiredStatus: RequiredStatus;
  taskId: Scalars["String"]["output"];
};

export type DispatcherSettings = {
  __typename?: "DispatcherSettings";
  version: DispatcherVersion;
};

export type DispatcherSettingsInput = {
  version: DispatcherVersion;
};

export enum DispatcherVersion {
  Revised = "REVISED",
  RevisedWithDependencies = "REVISED_WITH_DEPENDENCIES",
}

export type DisplayTask = {
  ExecTasks: Array<Scalars["String"]["input"]>;
  Name: Scalars["String"]["input"];
};

/** Distro models an environment configuration for a host. */
export type Distro = {
  __typename?: "Distro";
  aliases: Array<Scalars["String"]["output"]>;
  arch: Arch;
  authorizedKeysFile: Scalars["String"]["output"];
  bootstrapSettings: BootstrapSettings;
  cloneMethod: CloneMethod;
  containerPool: Scalars["String"]["output"];
  disableShallowClone: Scalars["Boolean"]["output"];
  disabled: Scalars["Boolean"]["output"];
  dispatcherSettings: DispatcherSettings;
  expansions: Array<Expansion>;
  finderSettings: FinderSettings;
  homeVolumeSettings: HomeVolumeSettings;
  hostAllocatorSettings: HostAllocatorSettings;
  iceCreamSettings: IceCreamSettings;
  isCluster: Scalars["Boolean"]["output"];
  isVirtualWorkStation: Scalars["Boolean"]["output"];
  mountpoints?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  name: Scalars["String"]["output"];
  note: Scalars["String"]["output"];
  plannerSettings: PlannerSettings;
  provider: Provider;
  providerSettingsList: Array<Scalars["Map"]["output"]>;
  setup: Scalars["String"]["output"];
  setupAsSudo: Scalars["Boolean"]["output"];
  sshKey: Scalars["String"]["output"];
  sshOptions: Array<Scalars["String"]["output"]>;
  user: Scalars["String"]["output"];
  userSpawnAllowed: Scalars["Boolean"]["output"];
  validProjects: Array<Maybe<Scalars["String"]["output"]>>;
  workDir: Scalars["String"]["output"];
};

export type DistroEvent = {
  __typename?: "DistroEvent";
  after?: Maybe<Scalars["Map"]["output"]>;
  before?: Maybe<Scalars["Map"]["output"]>;
  data?: Maybe<Scalars["Map"]["output"]>;
  timestamp: Scalars["Time"]["output"];
  user: Scalars["String"]["output"];
};

/** DistroEventsInput is the input to the distroEvents query. */
export type DistroEventsInput = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  distroId: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type DistroEventsPayload = {
  __typename?: "DistroEventsPayload";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<DistroEvent>;
};

export type DistroInfo = {
  __typename?: "DistroInfo";
  bootstrapMethod?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  isVirtualWorkStation?: Maybe<Scalars["Boolean"]["output"]>;
  isWindows?: Maybe<Scalars["Boolean"]["output"]>;
  user?: Maybe<Scalars["String"]["output"]>;
  workDir?: Maybe<Scalars["String"]["output"]>;
};

export type DistroInput = {
  aliases: Array<Scalars["String"]["input"]>;
  arch: Arch;
  authorizedKeysFile: Scalars["String"]["input"];
  bootstrapSettings: BootstrapSettingsInput;
  cloneMethod: CloneMethod;
  containerPool: Scalars["String"]["input"];
  disableShallowClone: Scalars["Boolean"]["input"];
  disabled: Scalars["Boolean"]["input"];
  dispatcherSettings: DispatcherSettingsInput;
  expansions: Array<ExpansionInput>;
  finderSettings: FinderSettingsInput;
  homeVolumeSettings: HomeVolumeSettingsInput;
  hostAllocatorSettings: HostAllocatorSettingsInput;
  iceCreamSettings: IceCreamSettingsInput;
  isCluster: Scalars["Boolean"]["input"];
  isVirtualWorkStation: Scalars["Boolean"]["input"];
  mountpoints?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  name: Scalars["String"]["input"];
  note: Scalars["String"]["input"];
  plannerSettings: PlannerSettingsInput;
  provider: Provider;
  providerSettingsList: Array<Scalars["Map"]["input"]>;
  setup: Scalars["String"]["input"];
  setupAsSudo: Scalars["Boolean"]["input"];
  sshKey: Scalars["String"]["input"];
  sshOptions: Array<Scalars["String"]["input"]>;
  user: Scalars["String"]["input"];
  userSpawnAllowed: Scalars["Boolean"]["input"];
  validProjects: Array<Scalars["String"]["input"]>;
  workDir: Scalars["String"]["input"];
};

export enum DistroOnSaveOperation {
  Decommission = "DECOMMISSION",
  None = "NONE",
  Reprovision = "REPROVISION",
  RestartJasper = "RESTART_JASPER",
}

export type DistroPermissions = {
  __typename?: "DistroPermissions";
  admin: Scalars["Boolean"]["output"];
  edit: Scalars["Boolean"]["output"];
  view: Scalars["Boolean"]["output"];
};

export type DistroPermissionsOptions = {
  distroId: Scalars["String"]["input"];
};

export enum DistroSettingsAccess {
  Admin = "ADMIN",
  Create = "CREATE",
  Edit = "EDIT",
  View = "VIEW",
}

export type EcsConfig = {
  __typename?: "ECSConfig";
  maxCPU: Scalars["Int"]["output"];
  maxMemoryMb: Scalars["Int"]["output"];
};

/**
 * EditSpawnHostInput is the input to the editSpawnHost mutation.
 * Its fields determine how a given host will be modified.
 */
export type EditSpawnHostInput = {
  addedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  hostId: Scalars["String"]["input"];
  instanceType?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  publicKey?: InputMaybe<PublicKeyInput>;
  savePublicKey?: InputMaybe<Scalars["Boolean"]["input"]>;
  servicePassword?: InputMaybe<Scalars["String"]["input"]>;
  volume?: InputMaybe<Scalars["String"]["input"]>;
};

export type EnvVar = {
  __typename?: "EnvVar";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type EnvVarInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type Expansion = {
  __typename?: "Expansion";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type ExpansionInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type ExternalLink = {
  __typename?: "ExternalLink";
  displayName: Scalars["String"]["output"];
  requesters: Array<Scalars["String"]["output"]>;
  urlTemplate: Scalars["String"]["output"];
};

export type ExternalLinkForMetadata = {
  __typename?: "ExternalLinkForMetadata";
  displayName: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type ExternalLinkInput = {
  displayName: Scalars["String"]["input"];
  requesters: Array<Scalars["String"]["input"]>;
  urlTemplate: Scalars["String"]["input"];
};

export enum FeedbackRule {
  Default = "DEFAULT",
  NoFeedback = "NO_FEEDBACK",
  WaitsOverThresh = "WAITS_OVER_THRESH",
}

export type File = {
  __typename?: "File";
  link: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  urlParsley?: Maybe<Scalars["String"]["output"]>;
  visibility: Scalars["String"]["output"];
};

export type FileDiff = {
  __typename?: "FileDiff";
  additions: Scalars["Int"]["output"];
  deletions: Scalars["Int"]["output"];
  description: Scalars["String"]["output"];
  diffLink: Scalars["String"]["output"];
  fileName: Scalars["String"]["output"];
};

export type FinderSettings = {
  __typename?: "FinderSettings";
  version: FinderVersion;
};

export type FinderSettingsInput = {
  version: FinderVersion;
};

export enum FinderVersion {
  Alternate = "ALTERNATE",
  Legacy = "LEGACY",
  Parallel = "PARALLEL",
  Pipeline = "PIPELINE",
}

export type GeneralSubscription = {
  __typename?: "GeneralSubscription";
  id: Scalars["String"]["output"];
  ownerType: Scalars["String"]["output"];
  regexSelectors: Array<Selector>;
  resourceType: Scalars["String"]["output"];
  selectors: Array<Selector>;
  subscriber?: Maybe<SubscriberWrapper>;
  trigger: Scalars["String"]["output"];
  triggerData?: Maybe<Scalars["StringMap"]["output"]>;
};

export type GitTag = {
  __typename?: "GitTag";
  pusher: Scalars["String"]["output"];
  tag: Scalars["String"]["output"];
};

export type GithubCheckSubscriber = {
  __typename?: "GithubCheckSubscriber";
  owner: Scalars["String"]["output"];
  ref: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
};

export type GithubPrSubscriber = {
  __typename?: "GithubPRSubscriber";
  owner: Scalars["String"]["output"];
  prNumber?: Maybe<Scalars["Int"]["output"]>;
  ref: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
};

/**
 * GithubProjectConflicts is the return value for the githubProjectConflicts query.
 * Its contains information about potential conflicts in the commit checks, the commit queue, and PR testing.
 */
export type GithubProjectConflicts = {
  __typename?: "GithubProjectConflicts";
  commitCheckIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
  commitQueueIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
  prTestingIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GithubUser = {
  __typename?: "GithubUser";
  lastKnownAs?: Maybe<Scalars["String"]["output"]>;
  uid?: Maybe<Scalars["Int"]["output"]>;
};

export type GithubUserInput = {
  lastKnownAs?: InputMaybe<Scalars["String"]["input"]>;
};

export type GroupedBuildVariant = {
  __typename?: "GroupedBuildVariant";
  displayName: Scalars["String"]["output"];
  tasks?: Maybe<Array<Maybe<Task>>>;
  variant: Scalars["String"]["output"];
};

export type GroupedFiles = {
  __typename?: "GroupedFiles";
  execution: Scalars["Int"]["output"];
  files?: Maybe<Array<File>>;
  taskId: Scalars["String"]["output"];
  taskName?: Maybe<Scalars["String"]["output"]>;
};

/**
 * GroupedProjects is the return value for the projects & viewableProjectRefs queries.
 * It contains an array of projects which are grouped under a groupDisplayName.
 */
export type GroupedProjects = {
  __typename?: "GroupedProjects";
  groupDisplayName: Scalars["String"]["output"];
  projects: Array<Project>;
  repo?: Maybe<RepoRef>;
};

export type GroupedTaskStatusCount = {
  __typename?: "GroupedTaskStatusCount";
  displayName: Scalars["String"]["output"];
  statusCounts: Array<StatusCount>;
  variant: Scalars["String"]["output"];
};

export type HomeVolumeSettings = {
  __typename?: "HomeVolumeSettings";
  formatCommand: Scalars["String"]["output"];
};

export type HomeVolumeSettingsInput = {
  formatCommand: Scalars["String"]["input"];
};

/** Host models a host, which are used for things like running tasks or as virtual workstations. */
export type Host = {
  __typename?: "Host";
  ami?: Maybe<Scalars["String"]["output"]>;
  availabilityZone?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  distro?: Maybe<DistroInfo>;
  distroId?: Maybe<Scalars["String"]["output"]>;
  elapsed?: Maybe<Scalars["Time"]["output"]>;
  expiration?: Maybe<Scalars["Time"]["output"]>;
  homeVolume?: Maybe<Volume>;
  homeVolumeID?: Maybe<Scalars["String"]["output"]>;
  hostUrl: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  instanceTags: Array<InstanceTag>;
  instanceType?: Maybe<Scalars["String"]["output"]>;
  lastCommunicationTime?: Maybe<Scalars["Time"]["output"]>;
  noExpiration: Scalars["Boolean"]["output"];
  provider: Scalars["String"]["output"];
  runningTask?: Maybe<TaskInfo>;
  startedBy: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  tag: Scalars["String"]["output"];
  totalIdleTime?: Maybe<Scalars["Duration"]["output"]>;
  uptime?: Maybe<Scalars["Time"]["output"]>;
  user?: Maybe<Scalars["String"]["output"]>;
  volumes: Array<Volume>;
};

export type HostAllocatorSettings = {
  __typename?: "HostAllocatorSettings";
  acceptableHostIdleTime: Scalars["Duration"]["output"];
  feedbackRule: FeedbackRule;
  futureHostFraction: Scalars["Float"]["output"];
  hostsOverallocatedRule: OverallocatedRule;
  maximumHosts: Scalars["Int"]["output"];
  minimumHosts: Scalars["Int"]["output"];
  roundingRule: RoundingRule;
  version: HostAllocatorVersion;
};

export type HostAllocatorSettingsInput = {
  acceptableHostIdleTime: Scalars["Int"]["input"];
  feedbackRule: FeedbackRule;
  futureHostFraction: Scalars["Float"]["input"];
  hostsOverallocatedRule: OverallocatedRule;
  maximumHosts: Scalars["Int"]["input"];
  minimumHosts: Scalars["Int"]["input"];
  roundingRule: RoundingRule;
  version: HostAllocatorVersion;
};

export enum HostAllocatorVersion {
  Utilization = "UTILIZATION",
}

export type HostEventLogData = {
  __typename?: "HostEventLogData";
  agentBuild: Scalars["String"]["output"];
  agentRevision: Scalars["String"]["output"];
  duration: Scalars["Duration"]["output"];
  execution: Scalars["String"]["output"];
  hostname: Scalars["String"]["output"];
  jasperRevision: Scalars["String"]["output"];
  logs: Scalars["String"]["output"];
  monitorOp: Scalars["String"]["output"];
  newStatus: Scalars["String"]["output"];
  oldStatus: Scalars["String"]["output"];
  provisioningMethod: Scalars["String"]["output"];
  successful: Scalars["Boolean"]["output"];
  taskId: Scalars["String"]["output"];
  taskPid: Scalars["String"]["output"];
  taskStatus: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

export type HostEventLogEntry = {
  __typename?: "HostEventLogEntry";
  data: HostEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt: Scalars["Time"]["output"];
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * HostEvents is the return value for the hostEvents query.
 * It contains the event log entries for a given host.
 */
export type HostEvents = {
  __typename?: "HostEvents";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<HostEventLogEntry>;
};

export enum HostSortBy {
  CurrentTask = "CURRENT_TASK",
  Distro = "DISTRO",
  Elapsed = "ELAPSED",
  Id = "ID",
  IdleTime = "IDLE_TIME",
  Owner = "OWNER",
  Status = "STATUS",
  Uptime = "UPTIME",
}

/**
 * HostsResponse is the return value for the hosts query.
 * It contains an array of Hosts matching the filter conditions, as well as some count information.
 */
export type HostsResponse = {
  __typename?: "HostsResponse";
  filteredHostsCount?: Maybe<Scalars["Int"]["output"]>;
  hosts: Array<Host>;
  totalHostsCount: Scalars["Int"]["output"];
};

export type IceCreamSettings = {
  __typename?: "IceCreamSettings";
  configPath: Scalars["String"]["output"];
  schedulerHost: Scalars["String"]["output"];
};

export type IceCreamSettingsInput = {
  configPath: Scalars["String"]["input"];
  schedulerHost: Scalars["String"]["input"];
};

export type InstanceTag = {
  __typename?: "InstanceTag";
  canBeModified: Scalars["Boolean"]["output"];
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type InstanceTagInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type IssueLink = {
  __typename?: "IssueLink";
  confidenceScore?: Maybe<Scalars["Float"]["output"]>;
  issueKey?: Maybe<Scalars["String"]["output"]>;
  jiraTicket?: Maybe<JiraTicket>;
  source?: Maybe<Source>;
  url?: Maybe<Scalars["String"]["output"]>;
};

/** IssueLinkInput is an input parameter to the annotation mutations. */
export type IssueLinkInput = {
  confidenceScore?: InputMaybe<Scalars["Float"]["input"]>;
  issueKey: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type JiraConfig = {
  __typename?: "JiraConfig";
  email?: Maybe<Scalars["String"]["output"]>;
  host?: Maybe<Scalars["String"]["output"]>;
};

export type JiraField = {
  __typename?: "JiraField";
  displayText: Scalars["String"]["output"];
  field: Scalars["String"]["output"];
};

export type JiraFieldInput = {
  displayText: Scalars["String"]["input"];
  field: Scalars["String"]["input"];
};

export type JiraIssueSubscriber = {
  __typename?: "JiraIssueSubscriber";
  issueType: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
};

export type JiraIssueSubscriberInput = {
  issueType: Scalars["String"]["input"];
  project: Scalars["String"]["input"];
};

export type JiraStatus = {
  __typename?: "JiraStatus";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type JiraTicket = {
  __typename?: "JiraTicket";
  fields: TicketFields;
  key: Scalars["String"]["output"];
};

export type LogMessage = {
  __typename?: "LogMessage";
  message?: Maybe<Scalars["String"]["output"]>;
  severity?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["Time"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type LogkeeperBuild = {
  __typename?: "LogkeeperBuild";
  buildNum: Scalars["Int"]["output"];
  builder: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  task: Task;
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
  tests: Array<LogkeeperTest>;
};

export type LogkeeperTest = {
  __typename?: "LogkeeperTest";
  buildId: Scalars["String"]["output"];
  command: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  phase: Scalars["String"]["output"];
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
};

export type MainlineCommitVersion = {
  __typename?: "MainlineCommitVersion";
  rolledUpVersions?: Maybe<Array<Version>>;
  version?: Maybe<Version>;
};

/**
 * MainlineCommits is returned by the mainline commits query.
 * It contains information about versions (both unactivated and activated) which is surfaced on the Project Health page.
 */
export type MainlineCommits = {
  __typename?: "MainlineCommits";
  nextPageOrderNumber?: Maybe<Scalars["Int"]["output"]>;
  prevPageOrderNumber?: Maybe<Scalars["Int"]["output"]>;
  versions: Array<MainlineCommitVersion>;
};

/**
 * MainlineCommitsOptions is an input to the mainlineCommits query.
 * Its fields determine what mainline commits we fetch for a given projectID.
 */
export type MainlineCommitsOptions = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  projectIdentifier: Scalars["String"]["input"];
  requesters?: InputMaybe<Array<Scalars["String"]["input"]>>;
  revision?: InputMaybe<Scalars["String"]["input"]>;
  shouldCollapse?: InputMaybe<Scalars["Boolean"]["input"]>;
  skipOrderNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Manifest = {
  __typename?: "Manifest";
  branch: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  isBase: Scalars["Boolean"]["output"];
  moduleOverrides?: Maybe<Scalars["StringMap"]["output"]>;
  modules?: Maybe<Scalars["Map"]["output"]>;
  project: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
};

export enum MergeQueue {
  Evergreen = "EVERGREEN",
  Github = "GITHUB",
}

export enum MetStatus {
  Met = "MET",
  Pending = "PENDING",
  Started = "STARTED",
  Unmet = "UNMET",
}

export type MetadataLink = {
  __typename?: "MetadataLink";
  source?: Maybe<Source>;
  text: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type MetadataLinkInput = {
  text: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type Module = {
  __typename?: "Module";
  issue?: Maybe<Scalars["String"]["output"]>;
  module?: Maybe<Scalars["String"]["output"]>;
};

export type ModuleCodeChange = {
  __typename?: "ModuleCodeChange";
  branchName: Scalars["String"]["output"];
  fileDiffs: Array<FileDiff>;
  htmlLink: Scalars["String"]["output"];
  rawLink: Scalars["String"]["output"];
};

/**
 * MoveProjectInput is the input to the attachProjectToNewRepo mutation.
 * It contains information used to move a project to a a new owner and repo.
 */
export type MoveProjectInput = {
  newOwner: Scalars["String"]["input"];
  newRepo: Scalars["String"]["input"];
  projectId: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  abortTask: Task;
  addAnnotationIssue: Scalars["Boolean"]["output"];
  addFavoriteProject: Project;
  attachProjectToNewRepo: Project;
  attachProjectToRepo: Project;
  attachVolumeToHost: Scalars["Boolean"]["output"];
  bbCreateTicket: Scalars["Boolean"]["output"];
  clearMySubscriptions: Scalars["Int"]["output"];
  copyDistro: NewDistroPayload;
  copyProject: Project;
  createDistro: NewDistroPayload;
  createProject: Project;
  createPublicKey: Array<PublicKey>;
  deactivateStepbackTask: Scalars["Boolean"]["output"];
  defaultSectionToRepo?: Maybe<Scalars["String"]["output"]>;
  deleteDistro: DeleteDistroPayload;
  deleteProject: Scalars["Boolean"]["output"];
  deleteSubscriptions: Scalars["Int"]["output"];
  detachProjectFromRepo: Project;
  detachVolumeFromHost: Scalars["Boolean"]["output"];
  editAnnotationNote: Scalars["Boolean"]["output"];
  editSpawnHost: Host;
  enqueuePatch: Patch;
  forceRepotrackerRun: Scalars["Boolean"]["output"];
  migrateVolume: Scalars["Boolean"]["output"];
  moveAnnotationIssue: Scalars["Boolean"]["output"];
  overrideTaskDependencies: Task;
  promoteVarsToRepo: Scalars["Boolean"]["output"];
  removeAnnotationIssue: Scalars["Boolean"]["output"];
  removeFavoriteProject: Project;
  removeItemFromCommitQueue?: Maybe<Scalars["String"]["output"]>;
  removePublicKey: Array<PublicKey>;
  removeVolume: Scalars["Boolean"]["output"];
  reprovisionToNew: Scalars["Int"]["output"];
  restartJasper: Scalars["Int"]["output"];
  restartTask: Task;
  restartVersions?: Maybe<Array<Version>>;
  saveDistro: SaveDistroPayload;
  saveProjectSettingsForSection: ProjectSettings;
  saveRepoSettingsForSection: RepoSettings;
  saveSubscription: Scalars["Boolean"]["output"];
  schedulePatch: Patch;
  schedulePatchTasks?: Maybe<Scalars["String"]["output"]>;
  scheduleTasks: Array<Task>;
  scheduleUndispatchedBaseTasks?: Maybe<Array<Task>>;
  setAnnotationMetadataLinks: Scalars["Boolean"]["output"];
  setLastRevision: SetLastRevisionPayload;
  setPatchPriority?: Maybe<Scalars["String"]["output"]>;
  /** setPatchVisibility takes a list of patch ids and a boolean to set the visibility on the my patches queries */
  setPatchVisibility: Array<Patch>;
  setTaskPriority: Task;
  spawnHost: Host;
  spawnVolume: Scalars["Boolean"]["output"];
  unschedulePatchTasks?: Maybe<Scalars["String"]["output"]>;
  unscheduleTask: Task;
  updateHostStatus: Scalars["Int"]["output"];
  updatePublicKey: Array<PublicKey>;
  updateSpawnHostStatus: Host;
  updateUserSettings: Scalars["Boolean"]["output"];
  updateVolume: Scalars["Boolean"]["output"];
};

export type MutationAbortTaskArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationAddAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationAddFavoriteProjectArgs = {
  identifier: Scalars["String"]["input"];
};

export type MutationAttachProjectToNewRepoArgs = {
  project: MoveProjectInput;
};

export type MutationAttachProjectToRepoArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationAttachVolumeToHostArgs = {
  volumeAndHost: VolumeHost;
};

export type MutationBbCreateTicketArgs = {
  execution?: InputMaybe<Scalars["Int"]["input"]>;
  taskId: Scalars["String"]["input"];
};

export type MutationCopyDistroArgs = {
  opts: CopyDistroInput;
};

export type MutationCopyProjectArgs = {
  project: CopyProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MutationCreateDistroArgs = {
  opts: CreateDistroInput;
};

export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MutationCreatePublicKeyArgs = {
  publicKeyInput: PublicKeyInput;
};

export type MutationDeactivateStepbackTaskArgs = {
  buildVariantName: Scalars["String"]["input"];
  projectId: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
};

export type MutationDefaultSectionToRepoArgs = {
  projectId: Scalars["String"]["input"];
  section: ProjectSettingsSection;
};

export type MutationDeleteDistroArgs = {
  opts: DeleteDistroInput;
};

export type MutationDeleteProjectArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationDeleteSubscriptionsArgs = {
  subscriptionIds: Array<Scalars["String"]["input"]>;
};

export type MutationDetachProjectFromRepoArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationDetachVolumeFromHostArgs = {
  volumeId: Scalars["String"]["input"];
};

export type MutationEditAnnotationNoteArgs = {
  execution: Scalars["Int"]["input"];
  newMessage: Scalars["String"]["input"];
  originalMessage: Scalars["String"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationEditSpawnHostArgs = {
  spawnHost?: InputMaybe<EditSpawnHostInput>;
};

export type MutationEnqueuePatchArgs = {
  commitMessage?: InputMaybe<Scalars["String"]["input"]>;
  patchId: Scalars["String"]["input"];
};

export type MutationForceRepotrackerRunArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationMigrateVolumeArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
  volumeId: Scalars["String"]["input"];
};

export type MutationMoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationOverrideTaskDependenciesArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationPromoteVarsToRepoArgs = {
  projectId: Scalars["String"]["input"];
  varNames: Array<Scalars["String"]["input"]>;
};

export type MutationRemoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationRemoveFavoriteProjectArgs = {
  identifier: Scalars["String"]["input"];
};

export type MutationRemoveItemFromCommitQueueArgs = {
  commitQueueId: Scalars["String"]["input"];
  issue: Scalars["String"]["input"];
};

export type MutationRemovePublicKeyArgs = {
  keyName: Scalars["String"]["input"];
};

export type MutationRemoveVolumeArgs = {
  volumeId: Scalars["String"]["input"];
};

export type MutationReprovisionToNewArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
};

export type MutationRestartJasperArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
};

export type MutationRestartTaskArgs = {
  failedOnly: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationRestartVersionsArgs = {
  abort: Scalars["Boolean"]["input"];
  versionId: Scalars["String"]["input"];
  versionsToRestart: Array<VersionToRestart>;
};

export type MutationSaveDistroArgs = {
  opts: SaveDistroInput;
};

export type MutationSaveProjectSettingsForSectionArgs = {
  projectSettings?: InputMaybe<ProjectSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationSaveRepoSettingsForSectionArgs = {
  repoSettings?: InputMaybe<RepoSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationSaveSubscriptionArgs = {
  subscription: SubscriptionInput;
};

export type MutationSchedulePatchArgs = {
  configure: PatchConfigure;
  patchId: Scalars["String"]["input"];
};

export type MutationSchedulePatchTasksArgs = {
  patchId: Scalars["String"]["input"];
};

export type MutationScheduleTasksArgs = {
  taskIds: Array<Scalars["String"]["input"]>;
};

export type MutationScheduleUndispatchedBaseTasksArgs = {
  patchId: Scalars["String"]["input"];
};

export type MutationSetAnnotationMetadataLinksArgs = {
  execution: Scalars["Int"]["input"];
  metadataLinks: Array<MetadataLinkInput>;
  taskId: Scalars["String"]["input"];
};

export type MutationSetLastRevisionArgs = {
  opts: SetLastRevisionInput;
};

export type MutationSetPatchPriorityArgs = {
  patchId: Scalars["String"]["input"];
  priority: Scalars["Int"]["input"];
};

export type MutationSetPatchVisibilityArgs = {
  hidden: Scalars["Boolean"]["input"];
  patchIds: Array<Scalars["String"]["input"]>;
};

export type MutationSetTaskPriorityArgs = {
  priority: Scalars["Int"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationSpawnHostArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
};

export type MutationSpawnVolumeArgs = {
  spawnVolumeInput: SpawnVolumeInput;
};

export type MutationUnschedulePatchTasksArgs = {
  abort: Scalars["Boolean"]["input"];
  patchId: Scalars["String"]["input"];
};

export type MutationUnscheduleTaskArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationUpdateHostStatusArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status: Scalars["String"]["input"];
};

export type MutationUpdatePublicKeyArgs = {
  targetKeyName: Scalars["String"]["input"];
  updateInfo: PublicKeyInput;
};

export type MutationUpdateSpawnHostStatusArgs = {
  action: SpawnHostStatusActions;
  hostId: Scalars["String"]["input"];
};

export type MutationUpdateUserSettingsArgs = {
  userSettings?: InputMaybe<UserSettingsInput>;
};

export type MutationUpdateVolumeArgs = {
  updateVolumeInput: UpdateVolumeInput;
};

/** Return type representing whether a distro was created and any validation errors */
export type NewDistroPayload = {
  __typename?: "NewDistroPayload";
  newDistroId: Scalars["String"]["output"];
};

export type Note = {
  __typename?: "Note";
  message: Scalars["String"]["output"];
  source: Source;
};

export type Notifications = {
  __typename?: "Notifications";
  buildBreak?: Maybe<Scalars["String"]["output"]>;
  buildBreakId?: Maybe<Scalars["String"]["output"]>;
  commitQueue?: Maybe<Scalars["String"]["output"]>;
  commitQueueId?: Maybe<Scalars["String"]["output"]>;
  patchFinish?: Maybe<Scalars["String"]["output"]>;
  patchFinishId?: Maybe<Scalars["String"]["output"]>;
  patchFirstFailure?: Maybe<Scalars["String"]["output"]>;
  patchFirstFailureId?: Maybe<Scalars["String"]["output"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]["output"]>;
  spawnHostExpirationId?: Maybe<Scalars["String"]["output"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]["output"]>;
  spawnHostOutcomeId?: Maybe<Scalars["String"]["output"]>;
};

export type NotificationsInput = {
  buildBreak?: InputMaybe<Scalars["String"]["input"]>;
  commitQueue?: InputMaybe<Scalars["String"]["input"]>;
  patchFinish?: InputMaybe<Scalars["String"]["input"]>;
  patchFirstFailure?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostExpiration?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostOutcome?: InputMaybe<Scalars["String"]["input"]>;
};

export type OomTrackerInfo = {
  __typename?: "OomTrackerInfo";
  detected: Scalars["Boolean"]["output"];
  pids?: Maybe<Array<Maybe<Scalars["Int"]["output"]>>>;
};

export enum OverallocatedRule {
  Default = "DEFAULT",
  Ignore = "IGNORE",
  Terminate = "TERMINATE",
}

export type Parameter = {
  __typename?: "Parameter";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type ParameterInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type ParsleyFilter = {
  __typename?: "ParsleyFilter";
  caseSensitive: Scalars["Boolean"]["output"];
  exactMatch: Scalars["Boolean"]["output"];
  expression: Scalars["String"]["output"];
};

export type ParsleyFilterInput = {
  caseSensitive: Scalars["Boolean"]["input"];
  exactMatch: Scalars["Boolean"]["input"];
  expression: Scalars["String"]["input"];
};

/** Patch is a manually initiated version submitted to test local code changes. */
export type Patch = {
  __typename?: "Patch";
  activated: Scalars["Boolean"]["output"];
  alias?: Maybe<Scalars["String"]["output"]>;
  author: Scalars["String"]["output"];
  authorDisplayName: Scalars["String"]["output"];
  baseTaskStatuses: Array<Scalars["String"]["output"]>;
  builds: Array<Build>;
  canEnqueueToCommitQueue: Scalars["Boolean"]["output"];
  childPatchAliases?: Maybe<Array<ChildPatchAlias>>;
  childPatches?: Maybe<Array<Patch>>;
  commitQueuePosition?: Maybe<Scalars["Int"]["output"]>;
  createTime?: Maybe<Scalars["Time"]["output"]>;
  description: Scalars["String"]["output"];
  duration?: Maybe<PatchDuration>;
  githash: Scalars["String"]["output"];
  hidden: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  moduleCodeChanges: Array<ModuleCodeChange>;
  parameters: Array<Parameter>;
  patchNumber: Scalars["Int"]["output"];
  patchTriggerAliases: Array<PatchTriggerAlias>;
  project?: Maybe<PatchProject>;
  projectID: Scalars["String"]["output"];
  projectIdentifier: Scalars["String"]["output"];
  projectMetadata?: Maybe<Project>;
  status: Scalars["String"]["output"];
  taskCount?: Maybe<Scalars["Int"]["output"]>;
  taskStatuses: Array<Scalars["String"]["output"]>;
  tasks: Array<Scalars["String"]["output"]>;
  time?: Maybe<PatchTime>;
  variants: Array<Scalars["String"]["output"]>;
  variantsTasks: Array<Maybe<VariantTask>>;
  versionFull?: Maybe<Version>;
};

/**
 * PatchConfigure is the input to the schedulePatch mutation.
 * It contains information about how a user has configured their patch (e.g. name, tasks to run, etc).
 */
export type PatchConfigure = {
  description: Scalars["String"]["input"];
  parameters?: InputMaybe<Array<InputMaybe<ParameterInput>>>;
  patchTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  variantsTasks: Array<VariantTasks>;
};

export type PatchDuration = {
  __typename?: "PatchDuration";
  makespan?: Maybe<Scalars["String"]["output"]>;
  time?: Maybe<PatchTime>;
  timeTaken?: Maybe<Scalars["String"]["output"]>;
};

export type PatchProject = {
  __typename?: "PatchProject";
  variants: Array<ProjectBuildVariant>;
};

export type PatchTime = {
  __typename?: "PatchTime";
  finished?: Maybe<Scalars["String"]["output"]>;
  started?: Maybe<Scalars["String"]["output"]>;
  submittedAt: Scalars["String"]["output"];
};

export type PatchTriggerAlias = {
  __typename?: "PatchTriggerAlias";
  alias: Scalars["String"]["output"];
  childProjectId: Scalars["String"]["output"];
  childProjectIdentifier: Scalars["String"]["output"];
  parentAsModule?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  taskSpecifiers?: Maybe<Array<TaskSpecifier>>;
  variantsTasks: Array<VariantTask>;
};

export type PatchTriggerAliasInput = {
  alias: Scalars["String"]["input"];
  childProjectIdentifier: Scalars["String"]["input"];
  parentAsModule?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  taskSpecifiers: Array<TaskSpecifierInput>;
};

/**
 * Patches is the return value of the patches field for the User and Project types.
 * It contains an array Patches for either an individual user or a project.
 */
export type Patches = {
  __typename?: "Patches";
  filteredPatchCount: Scalars["Int"]["output"];
  patches: Array<Patch>;
};

/**
 * PatchesInput is the input value to the patches field for the User and Project types.
 * Based on the information in PatchesInput, we return a list of Patches for either an individual user or a project.
 */
export type PatchesInput = {
  includeCommitQueue?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeHidden?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: Scalars["Int"]["input"];
  onlyCommitQueue?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: Scalars["Int"]["input"];
  patchName?: Scalars["String"]["input"];
  statuses?: Array<Scalars["String"]["input"]>;
};

export type PeriodicBuild = {
  __typename?: "PeriodicBuild";
  alias: Scalars["String"]["output"];
  configFile: Scalars["String"]["output"];
  cron: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  intervalHours: Scalars["Int"]["output"];
  message: Scalars["String"]["output"];
  nextRunTime: Scalars["Time"]["output"];
};

export type PeriodicBuildInput = {
  alias: Scalars["String"]["input"];
  configFile: Scalars["String"]["input"];
  cron?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  intervalHours: Scalars["Int"]["input"];
  message: Scalars["String"]["input"];
  nextRunTime: Scalars["Time"]["input"];
};

export type Permissions = {
  __typename?: "Permissions";
  canCreateDistro: Scalars["Boolean"]["output"];
  canCreateProject: Scalars["Boolean"]["output"];
  canEditAdminSettings: Scalars["Boolean"]["output"];
  distroPermissions: DistroPermissions;
  projectPermissions: ProjectPermissions;
  userId: Scalars["String"]["output"];
};

export type PermissionsDistroPermissionsArgs = {
  options: DistroPermissionsOptions;
};

export type PermissionsProjectPermissionsArgs = {
  options: ProjectPermissionsOptions;
};

export type PlannerSettings = {
  __typename?: "PlannerSettings";
  commitQueueFactor: Scalars["Int"]["output"];
  expectedRuntimeFactor: Scalars["Int"]["output"];
  generateTaskFactor: Scalars["Int"]["output"];
  groupVersions: Scalars["Boolean"]["output"];
  mainlineTimeInQueueFactor: Scalars["Int"]["output"];
  patchFactor: Scalars["Int"]["output"];
  patchTimeInQueueFactor: Scalars["Int"]["output"];
  targetTime: Scalars["Duration"]["output"];
  version: PlannerVersion;
};

export type PlannerSettingsInput = {
  commitQueueFactor: Scalars["Int"]["input"];
  expectedRuntimeFactor: Scalars["Int"]["input"];
  generateTaskFactor: Scalars["Int"]["input"];
  groupVersions: Scalars["Boolean"]["input"];
  mainlineTimeInQueueFactor: Scalars["Int"]["input"];
  patchFactor: Scalars["Int"]["input"];
  patchTimeInQueueFactor: Scalars["Int"]["input"];
  targetTime: Scalars["Int"]["input"];
  version: PlannerVersion;
};

export enum PlannerVersion {
  Legacy = "LEGACY",
  Tunable = "TUNABLE",
}

export type Pod = {
  __typename?: "Pod";
  events: PodEvents;
  id: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  task?: Maybe<Task>;
  taskContainerCreationOpts: TaskContainerCreationOpts;
  type: Scalars["String"]["output"];
};

export type PodEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PodEventLogData = {
  __typename?: "PodEventLogData";
  newStatus?: Maybe<Scalars["String"]["output"]>;
  oldStatus?: Maybe<Scalars["String"]["output"]>;
  reason?: Maybe<Scalars["String"]["output"]>;
  task?: Maybe<Task>;
  taskExecution?: Maybe<Scalars["Int"]["output"]>;
  taskID?: Maybe<Scalars["String"]["output"]>;
  taskStatus?: Maybe<Scalars["String"]["output"]>;
};

export type PodEventLogEntry = {
  __typename?: "PodEventLogEntry";
  data: PodEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt: Scalars["Time"]["output"];
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * PodEvents is the return value for the events query.
 * It contains the event log entries for a pod.
 */
export type PodEvents = {
  __typename?: "PodEvents";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<PodEventLogEntry>;
};

export type PreconditionScript = {
  __typename?: "PreconditionScript";
  path: Scalars["String"]["output"];
  script: Scalars["String"]["output"];
};

export type PreconditionScriptInput = {
  path: Scalars["String"]["input"];
  script: Scalars["String"]["input"];
};

/** Project models single repository on GitHub. */
export type Project = {
  __typename?: "Project";
  admins?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  banner?: Maybe<ProjectBanner>;
  batchTime: Scalars["Int"]["output"];
  branch: Scalars["String"]["output"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: CommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious?: Maybe<Scalars["Boolean"]["output"]>;
  disabledStatsCache?: Maybe<Scalars["Boolean"]["output"]>;
  dispatchingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  displayName: Scalars["String"]["output"];
  enabled?: Maybe<Scalars["Boolean"]["output"]>;
  externalLinks?: Maybe<Array<ExternalLink>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagVersionsEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubChecksEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  hidden?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["String"]["output"];
  identifier: Scalars["String"]["output"];
  isFavorite: Scalars["Boolean"]["output"];
  manualPrTestingEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  notifyOnBuildFailure?: Maybe<Scalars["Boolean"]["output"]>;
  owner: Scalars["String"]["output"];
  parsleyFilters?: Maybe<Array<ParsleyFilter>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patches: Patches;
  patchingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  perfEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  private?: Maybe<Scalars["Boolean"]["output"]>;
  projectHealthView: ProjectHealthView;
  remotePath: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  repoRefId: Scalars["String"]["output"];
  repotrackerDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  repotrackerError?: Maybe<RepotrackerError>;
  restricted?: Maybe<Scalars["Boolean"]["output"]>;
  spawnHostScriptPath: Scalars["String"]["output"];
  stepbackBisect?: Maybe<Scalars["Boolean"]["output"]>;
  stepbackDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  taskAnnotationSettings: TaskAnnotationSettings;
  taskSync: TaskSyncOptions;
  tracksPushEvents?: Maybe<Scalars["Boolean"]["output"]>;
  triggers?: Maybe<Array<TriggerAlias>>;
  versionControlEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  workstationConfig: WorkstationConfig;
};

/** Project models single repository on GitHub. */
export type ProjectPatchesArgs = {
  patchesInput: PatchesInput;
};

export type ProjectAlias = {
  __typename?: "ProjectAlias";
  alias: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  gitTag: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  parameters: Array<Parameter>;
  remotePath: Scalars["String"]["output"];
  task: Scalars["String"]["output"];
  taskTags: Array<Scalars["String"]["output"]>;
  variant: Scalars["String"]["output"];
  variantTags: Array<Scalars["String"]["output"]>;
};

export type ProjectAliasInput = {
  alias: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  gitTag: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
  parameters?: InputMaybe<Array<ParameterInput>>;
  remotePath: Scalars["String"]["input"];
  task: Scalars["String"]["input"];
  taskTags: Array<Scalars["String"]["input"]>;
  variant: Scalars["String"]["input"];
  variantTags: Array<Scalars["String"]["input"]>;
};

export type ProjectBanner = {
  __typename?: "ProjectBanner";
  text: Scalars["String"]["output"];
  theme: BannerTheme;
};

export type ProjectBannerInput = {
  text: Scalars["String"]["input"];
  theme: BannerTheme;
};

export type ProjectBuildVariant = {
  __typename?: "ProjectBuildVariant";
  displayName: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  tasks: Array<Scalars["String"]["output"]>;
};

export type ProjectEventLogEntry = {
  __typename?: "ProjectEventLogEntry";
  after?: Maybe<ProjectEventSettings>;
  before?: Maybe<ProjectEventSettings>;
  timestamp: Scalars["Time"]["output"];
  user: Scalars["String"]["output"];
};

export type ProjectEventSettings = {
  __typename?: "ProjectEventSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * ProjectEvents contains project event log entries that concern the history of changes related to project
 * settings.
 * Although RepoSettings uses RepoRef in practice to have stronger types, this can't be enforced
 * or event logs because new fields could always be introduced that don't exist in the old event logs.
 */
export type ProjectEvents = {
  __typename?: "ProjectEvents";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<ProjectEventLogEntry>;
};

export enum ProjectHealthView {
  All = "ALL",
  Failed = "FAILED",
}

export type ProjectInput = {
  admins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  banner?: InputMaybe<ProjectBannerInput>;
  batchTime?: InputMaybe<Scalars["Int"]["input"]>;
  branch?: InputMaybe<Scalars["String"]["input"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]["input"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubTriggerAliases?: InputMaybe<
    Array<InputMaybe<Scalars["String"]["input"]>>
  >;
  id: Scalars["String"]["input"];
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  parsleyFilters?: InputMaybe<Array<ParsleyFilterInput>>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectHealthView?: InputMaybe<ProjectHealthView>;
  remotePath?: InputMaybe<Scalars["String"]["input"]>;
  repo?: InputMaybe<Scalars["String"]["input"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  restricted?: InputMaybe<Scalars["Boolean"]["input"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]["input"]>;
  stepbackBisect?: InputMaybe<Scalars["Boolean"]["input"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  taskSync?: InputMaybe<TaskSyncOptionsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]["input"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

export type ProjectPermissions = {
  __typename?: "ProjectPermissions";
  edit: Scalars["Boolean"]["output"];
  view: Scalars["Boolean"]["output"];
};

export type ProjectPermissionsOptions = {
  projectIdentifier: Scalars["String"]["input"];
};

/** ProjectSettings models the settings for a given Project. */
export type ProjectSettings = {
  __typename?: "ProjectSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  vars?: Maybe<ProjectVars>;
};

export enum ProjectSettingsAccess {
  Edit = "EDIT",
  View = "VIEW",
}

/**
 * ProjectSettingsInput is the input to the saveProjectSettingsForSection mutation.
 * It contains information about project settings (e.g. Build Baron configurations, subscriptions, etc) and is used to
 * update the settings for a given project.
 */
export type ProjectSettingsInput = {
  aliases?: InputMaybe<Array<ProjectAliasInput>>;
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectRef?: InputMaybe<ProjectInput>;
  subscriptions?: InputMaybe<Array<SubscriptionInput>>;
  vars?: InputMaybe<ProjectVarsInput>;
};

export enum ProjectSettingsSection {
  Access = "ACCESS",
  Containers = "CONTAINERS",
  General = "GENERAL",
  GithubAndCommitQueue = "GITHUB_AND_COMMIT_QUEUE",
  Notifications = "NOTIFICATIONS",
  PatchAliases = "PATCH_ALIASES",
  PeriodicBuilds = "PERIODIC_BUILDS",
  Plugins = "PLUGINS",
  Triggers = "TRIGGERS",
  Variables = "VARIABLES",
  ViewsAndFilters = "VIEWS_AND_FILTERS",
  Workstation = "WORKSTATION",
}

export type ProjectVars = {
  __typename?: "ProjectVars";
  adminOnlyVars: Array<Scalars["String"]["output"]>;
  privateVars: Array<Scalars["String"]["output"]>;
  vars?: Maybe<Scalars["StringMap"]["output"]>;
};

export type ProjectVarsInput = {
  adminOnlyVarsList?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  privateVarsList?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  vars?: InputMaybe<Scalars["StringMap"]["input"]>;
};

export enum Provider {
  Docker = "DOCKER",
  Ec2Fleet = "EC2_FLEET",
  Ec2OnDemand = "EC2_ON_DEMAND",
  Static = "STATIC",
}

/** PublicKey models a public key. Users can save/modify/delete their public keys. */
export type PublicKey = {
  __typename?: "PublicKey";
  key: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

/** PublicKeyInput is an input to the createPublicKey and updatePublicKey mutations. */
export type PublicKeyInput = {
  key: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type Query = {
  __typename?: "Query";
  awsRegions?: Maybe<Array<Scalars["String"]["output"]>>;
  bbGetCreatedTickets: Array<JiraTicket>;
  buildBaron: BuildBaron;
  buildVariantsForTaskName?: Maybe<Array<Maybe<BuildVariantTuple>>>;
  clientConfig?: Maybe<ClientConfig>;
  commitQueue: CommitQueue;
  distro?: Maybe<Distro>;
  distroEvents: DistroEventsPayload;
  distroTaskQueue: Array<TaskQueueItem>;
  distros: Array<Maybe<Distro>>;
  githubProjectConflicts: GithubProjectConflicts;
  hasVersion: Scalars["Boolean"]["output"];
  host?: Maybe<Host>;
  hostEvents: HostEvents;
  hosts: HostsResponse;
  instanceTypes: Array<Scalars["String"]["output"]>;
  logkeeperBuildMetadata: LogkeeperBuild;
  mainlineCommits?: Maybe<MainlineCommits>;
  myHosts: Array<Host>;
  myPublicKeys: Array<PublicKey>;
  myVolumes: Array<Volume>;
  patch: Patch;
  pod: Pod;
  project: Project;
  projectEvents: ProjectEvents;
  projectSettings: ProjectSettings;
  projects: Array<Maybe<GroupedProjects>>;
  repoEvents: ProjectEvents;
  repoSettings: RepoSettings;
  spruceConfig?: Maybe<SpruceConfig>;
  subnetAvailabilityZones: Array<Scalars["String"]["output"]>;
  task?: Maybe<Task>;
  taskAllExecutions: Array<Task>;
  taskNamesForBuildVariant?: Maybe<Array<Scalars["String"]["output"]>>;
  taskQueueDistros: Array<TaskQueueDistro>;
  taskTestSample?: Maybe<Array<TaskTestResultSample>>;
  user: User;
  userConfig?: Maybe<UserConfig>;
  userSettings?: Maybe<UserSettings>;
  version: Version;
  viewableProjectRefs: Array<Maybe<GroupedProjects>>;
};

export type QueryBbGetCreatedTicketsArgs = {
  taskId: Scalars["String"]["input"];
};

export type QueryBuildBaronArgs = {
  execution: Scalars["Int"]["input"];
  taskId: Scalars["String"]["input"];
};

export type QueryBuildVariantsForTaskNameArgs = {
  projectIdentifier: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
};

export type QueryCommitQueueArgs = {
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryDistroArgs = {
  distroId: Scalars["String"]["input"];
};

export type QueryDistroEventsArgs = {
  opts: DistroEventsInput;
};

export type QueryDistroTaskQueueArgs = {
  distroId: Scalars["String"]["input"];
};

export type QueryDistrosArgs = {
  onlySpawnable: Scalars["Boolean"]["input"];
};

export type QueryGithubProjectConflictsArgs = {
  projectId: Scalars["String"]["input"];
};

export type QueryHasVersionArgs = {
  id: Scalars["String"]["input"];
};

export type QueryHostArgs = {
  hostId: Scalars["String"]["input"];
};

export type QueryHostEventsArgs = {
  hostId: Scalars["String"]["input"];
  hostTag?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryHostsArgs = {
  currentTaskId?: InputMaybe<Scalars["String"]["input"]>;
  distroId?: InputMaybe<Scalars["String"]["input"]>;
  hostId?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<HostSortBy>;
  sortDir?: InputMaybe<SortDirection>;
  startedBy?: InputMaybe<Scalars["String"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryLogkeeperBuildMetadataArgs = {
  buildId: Scalars["String"]["input"];
};

export type QueryMainlineCommitsArgs = {
  buildVariantOptions?: InputMaybe<BuildVariantOptions>;
  options: MainlineCommitsOptions;
};

export type QueryPatchArgs = {
  id: Scalars["String"]["input"];
};

export type QueryPodArgs = {
  podId: Scalars["String"]["input"];
};

export type QueryProjectArgs = {
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryProjectEventsArgs = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  identifier: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryProjectSettingsArgs = {
  identifier: Scalars["String"]["input"];
};

export type QueryRepoEventsArgs = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  id: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryRepoSettingsArgs = {
  id: Scalars["String"]["input"];
};

export type QueryTaskArgs = {
  execution?: InputMaybe<Scalars["Int"]["input"]>;
  taskId: Scalars["String"]["input"];
};

export type QueryTaskAllExecutionsArgs = {
  taskId: Scalars["String"]["input"];
};

export type QueryTaskNamesForBuildVariantArgs = {
  buildVariant: Scalars["String"]["input"];
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryTaskTestSampleArgs = {
  filters: Array<TestFilter>;
  tasks: Array<Scalars["String"]["input"]>;
};

export type QueryUserArgs = {
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryVersionArgs = {
  id: Scalars["String"]["input"];
};

export type RepoCommitQueueParams = {
  __typename?: "RepoCommitQueueParams";
  enabled: Scalars["Boolean"]["output"];
  mergeMethod: Scalars["String"]["output"];
  mergeQueue: MergeQueue;
  message: Scalars["String"]["output"];
};

/**
 * RepoRef is technically a special kind of Project.
 * Repo types have booleans defaulted, which is why it is necessary to redeclare the types despite them matching nearly
 * exactly.
 */
export type RepoRef = {
  __typename?: "RepoRef";
  admins: Array<Scalars["String"]["output"]>;
  batchTime: Scalars["Int"]["output"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: RepoCommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious: Scalars["Boolean"]["output"];
  disabledStatsCache: Scalars["Boolean"]["output"];
  dispatchingDisabled: Scalars["Boolean"]["output"];
  displayName: Scalars["String"]["output"];
  enabled: Scalars["Boolean"]["output"];
  externalLinks?: Maybe<Array<ExternalLink>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagVersionsEnabled: Scalars["Boolean"]["output"];
  githubChecksEnabled: Scalars["Boolean"]["output"];
  githubTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  id: Scalars["String"]["output"];
  manualPrTestingEnabled: Scalars["Boolean"]["output"];
  notifyOnBuildFailure: Scalars["Boolean"]["output"];
  owner: Scalars["String"]["output"];
  parsleyFilters?: Maybe<Array<ParsleyFilter>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patchingDisabled: Scalars["Boolean"]["output"];
  perfEnabled: Scalars["Boolean"]["output"];
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled: Scalars["Boolean"]["output"];
  private: Scalars["Boolean"]["output"];
  remotePath: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  repotrackerDisabled: Scalars["Boolean"]["output"];
  restricted: Scalars["Boolean"]["output"];
  spawnHostScriptPath: Scalars["String"]["output"];
  stepbackBisect?: Maybe<Scalars["Boolean"]["output"]>;
  stepbackDisabled: Scalars["Boolean"]["output"];
  taskAnnotationSettings: TaskAnnotationSettings;
  taskSync: RepoTaskSyncOptions;
  tracksPushEvents: Scalars["Boolean"]["output"];
  triggers: Array<TriggerAlias>;
  versionControlEnabled: Scalars["Boolean"]["output"];
  workstationConfig: RepoWorkstationConfig;
};

export type RepoRefInput = {
  admins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batchTime?: InputMaybe<Scalars["Int"]["input"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]["input"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id: Scalars["String"]["input"];
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  parsleyFilters?: InputMaybe<Array<ParsleyFilterInput>>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  remotePath?: InputMaybe<Scalars["String"]["input"]>;
  repo?: InputMaybe<Scalars["String"]["input"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  restricted?: InputMaybe<Scalars["Boolean"]["input"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]["input"]>;
  stepbackBisect?: InputMaybe<Scalars["Boolean"]["input"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  taskSync?: InputMaybe<TaskSyncOptionsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]["input"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

/** RepoSettings models the settings for a given RepoRef. */
export type RepoSettings = {
  __typename?: "RepoSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<RepoRef>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * RepoSettingsInput is the input to the saveRepoSettingsForSection mutation.
 * It contains information about repo settings (e.g. Build Baron configurations, subscriptions, etc) and is used to
 * update the settings for a given project.
 */
export type RepoSettingsInput = {
  aliases?: InputMaybe<Array<ProjectAliasInput>>;
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectRef?: InputMaybe<RepoRefInput>;
  subscriptions?: InputMaybe<Array<SubscriptionInput>>;
  vars?: InputMaybe<ProjectVarsInput>;
};

export type RepoTaskSyncOptions = {
  __typename?: "RepoTaskSyncOptions";
  configEnabled: Scalars["Boolean"]["output"];
  patchEnabled: Scalars["Boolean"]["output"];
};

export type RepoWorkstationConfig = {
  __typename?: "RepoWorkstationConfig";
  gitClone: Scalars["Boolean"]["output"];
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export type RepotrackerError = {
  __typename?: "RepotrackerError";
  exists: Scalars["Boolean"]["output"];
  invalidRevision: Scalars["String"]["output"];
  mergeBaseRevision: Scalars["String"]["output"];
};

export enum RequiredStatus {
  MustFail = "MUST_FAIL",
  MustFinish = "MUST_FINISH",
  MustSucceed = "MUST_SUCCEED",
}

export type ResourceLimits = {
  __typename?: "ResourceLimits";
  lockedMemoryKb: Scalars["Int"]["output"];
  numFiles: Scalars["Int"]["output"];
  numProcesses: Scalars["Int"]["output"];
  numTasks: Scalars["Int"]["output"];
  virtualMemoryKb: Scalars["Int"]["output"];
};

export type ResourceLimitsInput = {
  lockedMemoryKb: Scalars["Int"]["input"];
  numFiles: Scalars["Int"]["input"];
  numProcesses: Scalars["Int"]["input"];
  numTasks: Scalars["Int"]["input"];
  virtualMemoryKb: Scalars["Int"]["input"];
};

export enum RoundingRule {
  Default = "DEFAULT",
  Down = "DOWN",
  Up = "UP",
}

export type SshKey = {
  __typename?: "SSHKey";
  location: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

/** SaveDistroInput is the input to the saveDistro mutation. */
export type SaveDistroInput = {
  distro: DistroInput;
  onSave: DistroOnSaveOperation;
};

/** Return type representing the updated distro and the number of hosts that were updated. */
export type SaveDistroPayload = {
  __typename?: "SaveDistroPayload";
  distro: Distro;
  hostCount: Scalars["Int"]["output"];
};

export type SearchReturnInfo = {
  __typename?: "SearchReturnInfo";
  featuresURL: Scalars["String"]["output"];
  issues: Array<JiraTicket>;
  search: Scalars["String"]["output"];
  source: Scalars["String"]["output"];
};

export type Selector = {
  __typename?: "Selector";
  data: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type SelectorInput = {
  data: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

/**
 * SetLastRevisionInput is the input to the setLastRevision mutation.
 * It contains information used to fix the repotracker error of a project.
 */
export type SetLastRevisionInput = {
  projectIdentifier: Scalars["String"]["input"];
  revision: Scalars["String"]["input"];
};

export type SetLastRevisionPayload = {
  __typename?: "SetLastRevisionPayload";
  mergeBaseRevision: Scalars["String"]["output"];
};

export type SlackConfig = {
  __typename?: "SlackConfig";
  name?: Maybe<Scalars["String"]["output"]>;
};

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

/** SortOrder[] is an input value for version.tasks. It is used to define whether to sort by ASC/DEC for a given sort key. */
export type SortOrder = {
  Direction: SortDirection;
  Key: TaskSortCategory;
};

export type Source = {
  __typename?: "Source";
  author: Scalars["String"]["output"];
  requester: Scalars["String"]["output"];
  time: Scalars["Time"]["output"];
};

export type SpawnHostConfig = {
  __typename?: "SpawnHostConfig";
  spawnHostsPerUser: Scalars["Int"]["output"];
  unexpirableHostsPerUser: Scalars["Int"]["output"];
  unexpirableVolumesPerUser: Scalars["Int"]["output"];
};

/**
 * SpawnHostInput is the input to the spawnHost mutation.
 * Its fields determine the properties of the host that will be spawned.
 */
export type SpawnHostInput = {
  distroId: Scalars["String"]["input"];
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  homeVolumeSize?: InputMaybe<Scalars["Int"]["input"]>;
  isVirtualWorkStation: Scalars["Boolean"]["input"];
  noExpiration: Scalars["Boolean"]["input"];
  publicKey: PublicKeyInput;
  region: Scalars["String"]["input"];
  savePublicKey: Scalars["Boolean"]["input"];
  setUpScript?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostsStartedByTask?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskId?: InputMaybe<Scalars["String"]["input"]>;
  taskSync?: InputMaybe<Scalars["Boolean"]["input"]>;
  useProjectSetupScript?: InputMaybe<Scalars["Boolean"]["input"]>;
  useTaskConfig?: InputMaybe<Scalars["Boolean"]["input"]>;
  userDataScript?: InputMaybe<Scalars["String"]["input"]>;
  volumeId?: InputMaybe<Scalars["String"]["input"]>;
};

export enum SpawnHostStatusActions {
  Start = "START",
  Stop = "STOP",
  Terminate = "TERMINATE",
}

/**
 * SpawnVolumeInput is the input to the spawnVolume mutation.
 * Its fields determine the properties of the volume that will be spawned.
 */
export type SpawnVolumeInput = {
  availabilityZone: Scalars["String"]["input"];
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  host?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  size: Scalars["Int"]["input"];
  type: Scalars["String"]["input"];
};

/**
 * SpruceConfig defines settings that apply to all users of Evergreen.
 * For example, if the banner field is populated, then a sitewide banner will be shown to all users.
 */
export type SpruceConfig = {
  __typename?: "SpruceConfig";
  banner?: Maybe<Scalars["String"]["output"]>;
  bannerTheme?: Maybe<Scalars["String"]["output"]>;
  containerPools?: Maybe<ContainerPoolsConfig>;
  githubOrgs: Array<Scalars["String"]["output"]>;
  jira?: Maybe<JiraConfig>;
  keys: Array<SshKey>;
  providers?: Maybe<CloudProviderConfig>;
  slack?: Maybe<SlackConfig>;
  spawnHost: SpawnHostConfig;
  ui?: Maybe<UiConfig>;
};

export type StatusCount = {
  __typename?: "StatusCount";
  count: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
};

export type Subscriber = {
  __typename?: "Subscriber";
  emailSubscriber?: Maybe<Scalars["String"]["output"]>;
  githubCheckSubscriber?: Maybe<GithubCheckSubscriber>;
  githubPRSubscriber?: Maybe<GithubPrSubscriber>;
  jiraCommentSubscriber?: Maybe<Scalars["String"]["output"]>;
  jiraIssueSubscriber?: Maybe<JiraIssueSubscriber>;
  slackSubscriber?: Maybe<Scalars["String"]["output"]>;
  webhookSubscriber?: Maybe<WebhookSubscriber>;
};

export type SubscriberInput = {
  jiraIssueSubscriber?: InputMaybe<JiraIssueSubscriberInput>;
  target: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
  webhookSubscriber?: InputMaybe<WebhookSubscriberInput>;
};

export type SubscriberWrapper = {
  __typename?: "SubscriberWrapper";
  subscriber: Subscriber;
  type: Scalars["String"]["output"];
};

/**
 * SubscriptionInput is the input to the saveSubscription mutation.
 * It stores information about a user's subscription to a version or task. For example, a user
 * can have a subscription to send them a Slack message when a version finishes.
 */
export type SubscriptionInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  owner_type?: InputMaybe<Scalars["String"]["input"]>;
  regex_selectors: Array<SelectorInput>;
  resource_type?: InputMaybe<Scalars["String"]["input"]>;
  selectors: Array<SelectorInput>;
  subscriber: SubscriberInput;
  trigger?: InputMaybe<Scalars["String"]["input"]>;
  trigger_data: Scalars["StringMap"]["input"];
};

/** Task models a task, the simplest unit of execution for Evergreen. */
export type Task = {
  __typename?: "Task";
  abortInfo?: Maybe<AbortInfo>;
  aborted: Scalars["Boolean"]["output"];
  activated: Scalars["Boolean"]["output"];
  activatedBy?: Maybe<Scalars["String"]["output"]>;
  activatedTime?: Maybe<Scalars["Time"]["output"]>;
  ami?: Maybe<Scalars["String"]["output"]>;
  annotation?: Maybe<Annotation>;
  baseStatus?: Maybe<Scalars["String"]["output"]>;
  baseTask?: Maybe<Task>;
  blocked: Scalars["Boolean"]["output"];
  buildId: Scalars["String"]["output"];
  buildVariant: Scalars["String"]["output"];
  buildVariantDisplayName?: Maybe<Scalars["String"]["output"]>;
  canAbort: Scalars["Boolean"]["output"];
  canDisable: Scalars["Boolean"]["output"];
  canModifyAnnotation: Scalars["Boolean"]["output"];
  canOverrideDependencies: Scalars["Boolean"]["output"];
  canRestart: Scalars["Boolean"]["output"];
  canSchedule: Scalars["Boolean"]["output"];
  canSetPriority: Scalars["Boolean"]["output"];
  canSync: Scalars["Boolean"]["output"];
  canUnschedule: Scalars["Boolean"]["output"];
  containerAllocatedTime?: Maybe<Scalars["Time"]["output"]>;
  createTime?: Maybe<Scalars["Time"]["output"]>;
  dependsOn?: Maybe<Array<Dependency>>;
  details?: Maybe<TaskEndDetail>;
  dispatchTime?: Maybe<Scalars["Time"]["output"]>;
  displayName: Scalars["String"]["output"];
  displayOnly?: Maybe<Scalars["Boolean"]["output"]>;
  displayTask?: Maybe<Task>;
  distroId: Scalars["String"]["output"];
  estimatedStart?: Maybe<Scalars["Duration"]["output"]>;
  execution: Scalars["Int"]["output"];
  executionTasks?: Maybe<Array<Scalars["String"]["output"]>>;
  executionTasksFull?: Maybe<Array<Task>>;
  expectedDuration?: Maybe<Scalars["Duration"]["output"]>;
  failedTestCount: Scalars["Int"]["output"];
  files: TaskFiles;
  finishTime?: Maybe<Scalars["Time"]["output"]>;
  generateTask?: Maybe<Scalars["Boolean"]["output"]>;
  generatedBy?: Maybe<Scalars["String"]["output"]>;
  generatedByName?: Maybe<Scalars["String"]["output"]>;
  hostId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  ingestTime?: Maybe<Scalars["Time"]["output"]>;
  isPerfPluginEnabled: Scalars["Boolean"]["output"];
  latestExecution: Scalars["Int"]["output"];
  logs: TaskLogLinks;
  minQueuePosition: Scalars["Int"]["output"];
  order: Scalars["Int"]["output"];
  patch?: Maybe<Patch>;
  patchNumber?: Maybe<Scalars["Int"]["output"]>;
  pod?: Maybe<Pod>;
  priority?: Maybe<Scalars["Int"]["output"]>;
  project?: Maybe<Project>;
  projectId: Scalars["String"]["output"];
  projectIdentifier?: Maybe<Scalars["String"]["output"]>;
  requester: Scalars["String"]["output"];
  resetWhenFinished: Scalars["Boolean"]["output"];
  revision?: Maybe<Scalars["String"]["output"]>;
  scheduledTime?: Maybe<Scalars["Time"]["output"]>;
  spawnHostLink?: Maybe<Scalars["String"]["output"]>;
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  /** @deprecated Use files instead */
  taskFiles: TaskFiles;
  taskGroup?: Maybe<Scalars["String"]["output"]>;
  taskGroupMaxHosts?: Maybe<Scalars["Int"]["output"]>;
  /** taskLogs returns the tail 100 lines of the task's logs. */
  taskLogs: TaskLogs;
  tests: TaskTestResult;
  timeTaken?: Maybe<Scalars["Duration"]["output"]>;
  totalTestCount: Scalars["Int"]["output"];
  versionMetadata: Version;
};

/** Task models a task, the simplest unit of execution for Evergreen. */
export type TaskTestsArgs = {
  opts?: InputMaybe<TestFilterOptions>;
};

export type TaskAnnotationSettings = {
  __typename?: "TaskAnnotationSettings";
  fileTicketWebhook: Webhook;
  jiraCustomFields?: Maybe<Array<JiraField>>;
};

export type TaskAnnotationSettingsInput = {
  fileTicketWebhook?: InputMaybe<WebhookInput>;
  jiraCustomFields?: InputMaybe<Array<JiraFieldInput>>;
};

export type TaskContainerCreationOpts = {
  __typename?: "TaskContainerCreationOpts";
  arch: Scalars["String"]["output"];
  cpu: Scalars["Int"]["output"];
  image: Scalars["String"]["output"];
  memoryMB: Scalars["Int"]["output"];
  os: Scalars["String"]["output"];
  workingDir: Scalars["String"]["output"];
};

export type TaskEndDetail = {
  __typename?: "TaskEndDetail";
  description?: Maybe<Scalars["String"]["output"]>;
  oomTracker: OomTrackerInfo;
  status: Scalars["String"]["output"];
  timedOut?: Maybe<Scalars["Boolean"]["output"]>;
  timeoutType?: Maybe<Scalars["String"]["output"]>;
  traceID?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
};

export type TaskEventLogData = {
  __typename?: "TaskEventLogData";
  hostId?: Maybe<Scalars["String"]["output"]>;
  jiraIssue?: Maybe<Scalars["String"]["output"]>;
  jiraLink?: Maybe<Scalars["String"]["output"]>;
  podId?: Maybe<Scalars["String"]["output"]>;
  priority?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["Time"]["output"]>;
  userId?: Maybe<Scalars["String"]["output"]>;
};

export type TaskEventLogEntry = {
  __typename?: "TaskEventLogEntry";
  data: TaskEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt: Scalars["Time"]["output"];
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * TaskFiles is the return value for the taskFiles query.
 * Some tasks generate files which are represented by this type.
 */
export type TaskFiles = {
  __typename?: "TaskFiles";
  fileCount: Scalars["Int"]["output"];
  groupedFiles: Array<GroupedFiles>;
};

/** TaskFilterOptions defines the parameters that are used when fetching tasks from a Version. */
export type TaskFilterOptions = {
  baseStatuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** @deprecated Use includeNeverActivatedTasks instead */
  includeEmptyActivation?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeNeverActivatedTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sorts?: InputMaybe<Array<SortOrder>>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  taskName?: InputMaybe<Scalars["String"]["input"]>;
  variant?: InputMaybe<Scalars["String"]["input"]>;
};

export type TaskInfo = {
  __typename?: "TaskInfo";
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type TaskLogLinks = {
  __typename?: "TaskLogLinks";
  agentLogLink?: Maybe<Scalars["String"]["output"]>;
  allLogLink?: Maybe<Scalars["String"]["output"]>;
  eventLogLink?: Maybe<Scalars["String"]["output"]>;
  systemLogLink?: Maybe<Scalars["String"]["output"]>;
  taskLogLink?: Maybe<Scalars["String"]["output"]>;
};

/**
 * TaskLogs is the return value for the task.taskLogs query.
 * It contains the logs for a given task on a given execution.
 */
export type TaskLogs = {
  __typename?: "TaskLogs";
  agentLogs: Array<LogMessage>;
  allLogs: Array<LogMessage>;
  defaultLogger: Scalars["String"]["output"];
  eventLogs: Array<TaskEventLogEntry>;
  execution: Scalars["Int"]["output"];
  systemLogs: Array<LogMessage>;
  taskId: Scalars["String"]["output"];
  taskLogs: Array<LogMessage>;
};

/**
 * TaskQueueDistro[] is the return value for the taskQueueDistros query.
 * It contains information about how many tasks and hosts are running on on a particular distro.
 */
export type TaskQueueDistro = {
  __typename?: "TaskQueueDistro";
  hostCount: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  taskCount: Scalars["Int"]["output"];
};

/**
 * TaskQueueItem[] is the return value for the distroTaskQueue query.
 * It contains information about any particular item on the task queue, such as the name of the task, the build variant of the task,
 * and how long it's expected to take to finish running.
 */
export type TaskQueueItem = {
  __typename?: "TaskQueueItem";
  activatedBy: Scalars["String"]["output"];
  buildVariant: Scalars["String"]["output"];
  displayName: Scalars["String"]["output"];
  expectedDuration: Scalars["Duration"]["output"];
  id: Scalars["ID"]["output"];
  priority: Scalars["Int"]["output"];
  project: Scalars["String"]["output"];
  requester: TaskQueueItemType;
  revision: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

export enum TaskQueueItemType {
  Commit = "COMMIT",
  Patch = "PATCH",
}

export enum TaskSortCategory {
  BaseStatus = "BASE_STATUS",
  Duration = "DURATION",
  Name = "NAME",
  Status = "STATUS",
  Variant = "VARIANT",
}

export type TaskSpecifier = {
  __typename?: "TaskSpecifier";
  patchAlias: Scalars["String"]["output"];
  taskRegex: Scalars["String"]["output"];
  variantRegex: Scalars["String"]["output"];
};

export type TaskSpecifierInput = {
  patchAlias: Scalars["String"]["input"];
  taskRegex: Scalars["String"]["input"];
  variantRegex: Scalars["String"]["input"];
};

export type TaskStats = {
  __typename?: "TaskStats";
  counts?: Maybe<Array<StatusCount>>;
  eta?: Maybe<Scalars["Time"]["output"]>;
};

export type TaskSyncOptions = {
  __typename?: "TaskSyncOptions";
  configEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  patchEnabled?: Maybe<Scalars["Boolean"]["output"]>;
};

export type TaskSyncOptionsInput = {
  configEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  patchEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * TaskTestResult is the return value for the task.Tests resolver.
 * It contains the test results for a task. For example, if there is a task to run all unit tests, then the test results
 * could be the result of each individual unit test.
 */
export type TaskTestResult = {
  __typename?: "TaskTestResult";
  filteredTestCount: Scalars["Int"]["output"];
  testResults: Array<TestResult>;
  totalTestCount: Scalars["Int"]["output"];
};

/**
 * TaskTestResultSample is the return value for the taskTestSample query.
 * It is used to represent failing test results on the task history pages.
 */
export type TaskTestResultSample = {
  __typename?: "TaskTestResultSample";
  execution: Scalars["Int"]["output"];
  matchingFailedTestNames: Array<Scalars["String"]["output"]>;
  taskId: Scalars["String"]["output"];
  totalTestCount: Scalars["Int"]["output"];
};

/**
 * TestFilter is an input value for the taskTestSample query.
 * It's used to filter for tests with testName and status testStatus.
 */
export type TestFilter = {
  testName: Scalars["String"]["input"];
  testStatus: Scalars["String"]["input"];
};

/**
 * TestFilterOptions is an input for the task.Tests query.
 * It's used to filter, sort, and paginate test results of a task.
 */
export type TestFilterOptions = {
  excludeDisplayNames?: InputMaybe<Scalars["Boolean"]["input"]>;
  groupID?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<TestSortOptions>>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  testName?: InputMaybe<Scalars["String"]["input"]>;
};

export type TestLog = {
  __typename?: "TestLog";
  lineNum?: Maybe<Scalars["Int"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use urlParsley instead */
  urlLobster?: Maybe<Scalars["String"]["output"]>;
  urlParsley?: Maybe<Scalars["String"]["output"]>;
  urlRaw?: Maybe<Scalars["String"]["output"]>;
};

export type TestResult = {
  __typename?: "TestResult";
  baseStatus?: Maybe<Scalars["String"]["output"]>;
  duration?: Maybe<Scalars["Float"]["output"]>;
  endTime?: Maybe<Scalars["Time"]["output"]>;
  execution?: Maybe<Scalars["Int"]["output"]>;
  exitCode?: Maybe<Scalars["Int"]["output"]>;
  groupID?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  logs: TestLog;
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  taskId?: Maybe<Scalars["String"]["output"]>;
  testFile: Scalars["String"]["output"];
};

export enum TestSortCategory {
  BaseStatus = "BASE_STATUS",
  Duration = "DURATION",
  StartTime = "START_TIME",
  Status = "STATUS",
  TestName = "TEST_NAME",
}

/**
 * TestSortOptions is an input for the task.Tests query.
 * It's used to define sort criteria for test results of a task.
 */
export type TestSortOptions = {
  direction: SortDirection;
  sortBy: TestSortCategory;
};

export type TicketFields = {
  __typename?: "TicketFields";
  assignedTeam?: Maybe<Scalars["String"]["output"]>;
  assigneeDisplayName?: Maybe<Scalars["String"]["output"]>;
  created: Scalars["String"]["output"];
  resolutionName?: Maybe<Scalars["String"]["output"]>;
  status: JiraStatus;
  summary: Scalars["String"]["output"];
  updated: Scalars["String"]["output"];
};

export type TriggerAlias = {
  __typename?: "TriggerAlias";
  alias: Scalars["String"]["output"];
  buildVariantRegex: Scalars["String"]["output"];
  configFile: Scalars["String"]["output"];
  dateCutoff?: Maybe<Scalars["Int"]["output"]>;
  level: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  taskRegex: Scalars["String"]["output"];
  unscheduleDownstreamVersions?: Maybe<Scalars["Boolean"]["output"]>;
};

export type TriggerAliasInput = {
  alias: Scalars["String"]["input"];
  buildVariantRegex: Scalars["String"]["input"];
  configFile: Scalars["String"]["input"];
  dateCutoff?: InputMaybe<Scalars["Int"]["input"]>;
  level: Scalars["String"]["input"];
  project: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
  taskRegex: Scalars["String"]["input"];
  unscheduleDownstreamVersions?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type UiConfig = {
  __typename?: "UIConfig";
  defaultProject: Scalars["String"]["output"];
  userVoice?: Maybe<Scalars["String"]["output"]>;
};

/**
 * UpdateVolumeInput is the input to the updateVolume mutation.
 * Its fields determine how a given volume will be modified.
 */
export type UpdateVolumeInput = {
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  volumeId: Scalars["String"]["input"];
};

export type UpstreamProject = {
  __typename?: "UpstreamProject";
  owner: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  resourceID: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
  task?: Maybe<Task>;
  triggerID: Scalars["String"]["output"];
  triggerType: Scalars["String"]["output"];
  version?: Maybe<Version>;
};

export type UseSpruceOptions = {
  __typename?: "UseSpruceOptions";
  hasUsedMainlineCommitsBefore?: Maybe<Scalars["Boolean"]["output"]>;
  hasUsedSpruceBefore?: Maybe<Scalars["Boolean"]["output"]>;
  spruceV1?: Maybe<Scalars["Boolean"]["output"]>;
};

export type UseSpruceOptionsInput = {
  hasUsedMainlineCommitsBefore?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasUsedSpruceBefore?: InputMaybe<Scalars["Boolean"]["input"]>;
  spruceV1?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * User is returned by the user query.
 * It contains information about a user's id, name, email, and permissions.
 */
export type User = {
  __typename?: "User";
  displayName: Scalars["String"]["output"];
  emailAddress: Scalars["String"]["output"];
  patches: Patches;
  permissions: Permissions;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  userId: Scalars["String"]["output"];
};

/**
 * User is returned by the user query.
 * It contains information about a user's id, name, email, and permissions.
 */
export type UserPatchesArgs = {
  patchesInput: PatchesInput;
};

/**
 * UserConfig is returned by the userConfig query.
 * It contains configuration information such as the user's api key for the Evergreen CLI and a user's
 * preferred UI (legacy vs Spruce).
 */
export type UserConfig = {
  __typename?: "UserConfig";
  api_key: Scalars["String"]["output"];
  api_server_host: Scalars["String"]["output"];
  ui_server_host: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

/**
 * UserSettings is returned by the userSettings query.
 * It contains information about a user's settings, such as their GitHub username or timezone.
 */
export type UserSettings = {
  __typename?: "UserSettings";
  dateFormat?: Maybe<Scalars["String"]["output"]>;
  githubUser?: Maybe<GithubUser>;
  notifications?: Maybe<Notifications>;
  region?: Maybe<Scalars["String"]["output"]>;
  slackMemberId?: Maybe<Scalars["String"]["output"]>;
  slackUsername?: Maybe<Scalars["String"]["output"]>;
  timezone?: Maybe<Scalars["String"]["output"]>;
  useSpruceOptions?: Maybe<UseSpruceOptions>;
};

/**
 * UserSettingsInput is the input to the updateUserSettings mutation.
 * It is used to update user information such as GitHub or Slack username.
 */
export type UserSettingsInput = {
  dateFormat?: InputMaybe<Scalars["String"]["input"]>;
  githubUser?: InputMaybe<GithubUserInput>;
  notifications?: InputMaybe<NotificationsInput>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  slackMemberId?: InputMaybe<Scalars["String"]["input"]>;
  slackUsername?: InputMaybe<Scalars["String"]["input"]>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
  useSpruceOptions?: InputMaybe<UseSpruceOptionsInput>;
};

export type VariantTask = {
  __typename?: "VariantTask";
  name: Scalars["String"]["output"];
  tasks: Array<Scalars["String"]["output"]>;
};

export type VariantTasks = {
  displayTasks: Array<DisplayTask>;
  tasks: Array<Scalars["String"]["input"]>;
  variant: Scalars["String"]["input"];
};

/** Version models a commit within a project. */
export type Version = {
  __typename?: "Version";
  activated?: Maybe<Scalars["Boolean"]["output"]>;
  author: Scalars["String"]["output"];
  authorEmail: Scalars["String"]["output"];
  baseTaskStatuses: Array<Scalars["String"]["output"]>;
  baseVersion?: Maybe<Version>;
  branch: Scalars["String"]["output"];
  buildVariantStats?: Maybe<Array<GroupedTaskStatusCount>>;
  buildVariants?: Maybe<Array<Maybe<GroupedBuildVariant>>>;
  childVersions?: Maybe<Array<Maybe<Version>>>;
  createTime: Scalars["Time"]["output"];
  errors: Array<Scalars["String"]["output"]>;
  externalLinksForMetadata: Array<ExternalLinkForMetadata>;
  finishTime?: Maybe<Scalars["Time"]["output"]>;
  gitTags?: Maybe<Array<GitTag>>;
  id: Scalars["String"]["output"];
  ignored: Scalars["Boolean"]["output"];
  isPatch: Scalars["Boolean"]["output"];
  manifest?: Maybe<Manifest>;
  message: Scalars["String"]["output"];
  order: Scalars["Int"]["output"];
  parameters: Array<Parameter>;
  patch?: Maybe<Patch>;
  previousVersion?: Maybe<Version>;
  project: Scalars["String"]["output"];
  projectIdentifier: Scalars["String"]["output"];
  projectMetadata?: Maybe<Project>;
  repo: Scalars["String"]["output"];
  requester: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  taskCount?: Maybe<Scalars["Int"]["output"]>;
  taskStatusStats?: Maybe<TaskStats>;
  taskStatuses: Array<Scalars["String"]["output"]>;
  tasks: VersionTasks;
  upstreamProject?: Maybe<UpstreamProject>;
  versionTiming?: Maybe<VersionTiming>;
  warnings: Array<Scalars["String"]["output"]>;
};

/** Version models a commit within a project. */
export type VersionBuildVariantStatsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionBuildVariantsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionTaskStatusStatsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionTasksArgs = {
  options: TaskFilterOptions;
};

export type VersionTasks = {
  __typename?: "VersionTasks";
  count: Scalars["Int"]["output"];
  data: Array<Task>;
};

export type VersionTiming = {
  __typename?: "VersionTiming";
  makespan?: Maybe<Scalars["Duration"]["output"]>;
  timeTaken?: Maybe<Scalars["Duration"]["output"]>;
};

/**
 * VersionToRestart is the input to the restartVersions mutation.
 * It contains an array of taskIds to restart for a given versionId.
 */
export type VersionToRestart = {
  taskIds: Array<Scalars["String"]["input"]>;
  versionId: Scalars["String"]["input"];
};

export type Volume = {
  __typename?: "Volume";
  availabilityZone: Scalars["String"]["output"];
  createdBy: Scalars["String"]["output"];
  creationTime?: Maybe<Scalars["Time"]["output"]>;
  deviceName?: Maybe<Scalars["String"]["output"]>;
  displayName: Scalars["String"]["output"];
  expiration?: Maybe<Scalars["Time"]["output"]>;
  homeVolume: Scalars["Boolean"]["output"];
  host?: Maybe<Host>;
  hostID: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  migrating: Scalars["Boolean"]["output"];
  noExpiration: Scalars["Boolean"]["output"];
  size: Scalars["Int"]["output"];
  type: Scalars["String"]["output"];
};

/**
 * VolumeHost is the input to the attachVolumeToHost mutation.
 * Its fields are used to attach the volume with volumeId to the host with hostId.
 */
export type VolumeHost = {
  hostId: Scalars["String"]["input"];
  volumeId: Scalars["String"]["input"];
};

export type Webhook = {
  __typename?: "Webhook";
  endpoint: Scalars["String"]["output"];
  secret: Scalars["String"]["output"];
};

export type WebhookHeader = {
  __typename?: "WebhookHeader";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type WebhookHeaderInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type WebhookInput = {
  endpoint: Scalars["String"]["input"];
  secret: Scalars["String"]["input"];
};

export type WebhookSubscriber = {
  __typename?: "WebhookSubscriber";
  headers: Array<Maybe<WebhookHeader>>;
  minDelayMs: Scalars["Int"]["output"];
  retries: Scalars["Int"]["output"];
  secret: Scalars["String"]["output"];
  timeoutMs: Scalars["Int"]["output"];
  url: Scalars["String"]["output"];
};

export type WebhookSubscriberInput = {
  headers: Array<InputMaybe<WebhookHeaderInput>>;
  minDelayMs?: InputMaybe<Scalars["Int"]["input"]>;
  retries?: InputMaybe<Scalars["Int"]["input"]>;
  secret: Scalars["String"]["input"];
  timeoutMs?: InputMaybe<Scalars["Int"]["input"]>;
  url: Scalars["String"]["input"];
};

export type WorkstationConfig = {
  __typename?: "WorkstationConfig";
  gitClone?: Maybe<Scalars["Boolean"]["output"]>;
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export type WorkstationConfigInput = {
  gitClone?: InputMaybe<Scalars["Boolean"]["input"]>;
  setupCommands?: InputMaybe<Array<WorkstationSetupCommandInput>>;
};

export type WorkstationSetupCommand = {
  __typename?: "WorkstationSetupCommand";
  command: Scalars["String"]["output"];
  directory: Scalars["String"]["output"];
};

export type WorkstationSetupCommandInput = {
  command: Scalars["String"]["input"];
  directory?: InputMaybe<Scalars["String"]["input"]>;
};

export type BaseTaskFragment = {
  __typename?: "Task";
  displayName: string;
  execution: number;
  id: string;
  patchNumber?: number | null;
  status: string;
  versionMetadata: {
    __typename?: "Version";
    id: string;
    isPatch: boolean;
    message: string;
    projectIdentifier: string;
    revision: string;
  };
};

export type LogkeeperTaskQueryVariables = Exact<{
  buildId: Scalars["String"]["input"];
}>;

export type LogkeeperTaskQuery = {
  __typename?: "Query";
  logkeeperBuildMetadata: {
    __typename?: "LogkeeperBuild";
    id: string;
    task: {
      __typename?: "Task";
      displayName: string;
      execution: number;
      id: string;
      patchNumber?: number | null;
      status: string;
      tests: {
        __typename?: "TaskTestResult";
        testResults: Array<{
          __typename?: "TestResult";
          id: string;
          status: string;
          testFile: string;
          logs: { __typename?: "TestLog"; urlRaw?: string | null };
        }>;
      };
      versionMetadata: {
        __typename?: "Version";
        id: string;
        isPatch: boolean;
        message: string;
        projectIdentifier: string;
        revision: string;
      };
    };
  };
};

export type TaskQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type TaskQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    displayName: string;
    execution: number;
    id: string;
    patchNumber?: number | null;
    status: string;
    versionMetadata: {
      __typename?: "Version";
      id: string;
      isPatch: boolean;
      message: string;
      projectIdentifier: string;
      revision: string;
    };
  } | null;
};

export type TestLogUrlQueryVariables = Exact<{
  taskID: Scalars["String"]["input"];
  testName: Scalars["String"]["input"];
  execution: Scalars["Int"]["input"];
}>;

export type TestLogUrlQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    id: string;
    tests: {
      __typename?: "TaskTestResult";
      testResults: Array<{
        __typename?: "TestResult";
        id: string;
        logs: {
          __typename?: "TestLog";
          url?: string | null;
          urlLobster?: string | null;
          urlRaw?: string | null;
        };
      }>;
    };
  } | null;
};

export type UserQueryVariables = Exact<{ [key: string]: never }>;

export type UserQuery = {
  __typename?: "Query";
  user: { __typename?: "User"; userId: string };
};

export type ProjectFiltersQueryVariables = Exact<{
  projectIdentifier: Scalars["String"]["input"];
}>;

export type ProjectFiltersQuery = {
  __typename?: "Query";
  project: {
    __typename?: "Project";
    id: string;
    parsleyFilters?: Array<{
      __typename?: "ParsleyFilter";
      caseSensitive: boolean;
      exactMatch: boolean;
      expression: string;
    }> | null;
  };
};

export type TaskFilesQueryVariables = Exact<{
  taskId: Scalars["String"]["input"];
  execution?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type TaskFilesQuery = {
  __typename?: "Query";
  task?: {
    __typename?: "Task";
    execution: number;
    id: string;
    files: {
      __typename?: "TaskFiles";
      groupedFiles: Array<{
        __typename?: "GroupedFiles";
        execution: number;
        taskId: string;
        taskName?: string | null;
        files?: Array<{
          __typename?: "File";
          link: string;
          name: string;
        }> | null;
      }>;
    };
  } | null;
};
