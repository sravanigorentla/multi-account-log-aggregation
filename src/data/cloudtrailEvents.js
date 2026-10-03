const services = [
  'IAM', 'S3', 'EC2', 'Lambda', 'RDS', 'CloudFormation',
  'DynamoDB', 'SQS', 'SNS', 'CloudWatch', 'KMS', 'VPC',
  'ECS', 'EKS', 'STS', 'SSM', 'SecretsManager', 'GuardDuty',
];

const eventNames = {
  IAM: ['CreateUser', 'DeleteUser', 'AttachRolePolicy', 'CreateRole', 'PutRolePolicy', 'UpdateAccessKey', 'CreateAccessKey', 'DeleteAccessKey', 'ConsoleLogin'],
  S3: ['PutObject', 'GetObject', 'DeleteObject', 'CreateBucket', 'PutBucketPolicy', 'DeleteBucket', 'PutBucketEncryption', 'GetBucketAcl'],
  EC2: ['RunInstances', 'TerminateInstances', 'StartInstances', 'StopInstances', 'AuthorizeSecurityGroupIngress', 'CreateSecurityGroup', 'ModifyInstanceAttribute'],
  Lambda: ['CreateFunction', 'UpdateFunctionCode', 'InvokeFunction', 'DeleteFunction', 'UpdateFunctionConfiguration', 'AddPermission'],
  RDS: ['CreateDBInstance', 'DeleteDBInstance', 'ModifyDBInstance', 'CreateDBSnapshot', 'RestoreDBInstanceFromDBSnapshot'],
  CloudFormation: ['CreateStack', 'DeleteStack', 'UpdateStack', 'DescribeStacks', 'CreateChangeSet'],
  DynamoDB: ['CreateTable', 'DeleteTable', 'PutItem', 'GetItem', 'UpdateItem', 'Query'],
  SQS: ['CreateQueue', 'DeleteQueue', 'SendMessage', 'ReceiveMessage', 'SetQueueAttributes'],
  SNS: ['CreateTopic', 'DeleteTopic', 'Publish', 'Subscribe', 'Unsubscribe'],
  CloudWatch: ['PutMetricAlarm', 'DeleteAlarms', 'PutMetricData', 'DescribeAlarms', 'PutDashboard'],
  KMS: ['CreateKey', 'ScheduleKeyDeletion', 'Encrypt', 'Decrypt', 'GenerateDataKey', 'EnableKeyRotation'],
  VPC: ['CreateVpc', 'DeleteVpc', 'CreateSubnet', 'ModifySubnetAttribute', 'CreateInternetGateway'],
  ECS: ['CreateCluster', 'RunTask', 'StopTask', 'RegisterTaskDefinition', 'UpdateService'],
  EKS: ['CreateCluster', 'DeleteCluster', 'UpdateClusterConfig', 'CreateNodegroup'],
  STS: ['AssumeRole', 'GetCallerIdentity', 'AssumeRoleWithSAML', 'GetSessionToken'],
  SSM: ['GetParameter', 'PutParameter', 'SendCommand', 'StartSession', 'DescribeInstanceInformation'],
  SecretsManager: ['GetSecretValue', 'CreateSecret', 'PutSecretValue', 'RotateSecret', 'DeleteSecret'],
  GuardDuty: ['CreateDetector', 'GetFindings', 'UpdateDetector', 'ListFindings'],
};

const users = [
  'admin@company.com', 'john.doe@company.com', 'jane.smith@company.com',
  'devops-pipeline', 'lambda-execution-role', 'ci-cd-service',
  'sarah.chen@company.com', 'mike.johnson@company.com', 'deploy-bot',
  'monitoring-service', 'root', 'terraform-service',
];

const accountNames = [
  'Production - US East', 'Production - EU West', 'Staging Environment',
  'Development - Backend', 'Development - Frontend', 'Security Audit',
  'Shared Services', 'QA Automated Testing', 'Data Analytics',
];

const accountIds = [
  '123456789012', '234567890123', '345678901234',
  '456789012345', '567890123456', '678901234567',
  '789012345678', '890123456789', '901234567890',
];

const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'us-east-2', 'ap-southeast-1'];

const sourceIPs = [
  '10.0.1.45', '10.0.2.88', '10.0.3.102', '192.168.1.50', '172.16.0.25',
  '203.0.113.42', '198.51.100.15', '10.0.4.200', '10.0.5.33', 'AWS Internal',
  '52.94.133.12', '54.239.28.85', 'cloudformation.amazonaws.com',
  'lambda.amazonaws.com', 'ecs.amazonaws.com',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEvent(index) {
  const service = randomFrom(services);
  const events = eventNames[service];
  const eventName = randomFrom(events);
  const acctIdx = Math.floor(Math.random() * accountNames.length);
  const user = randomFrom(users);
  const isError = Math.random() < 0.08;
  const isReadOnly = ['GetObject', 'GetItem', 'Query', 'DescribeStacks', 'GetParameter',
    'GetSecretValue', 'GetCallerIdentity', 'GetFindings', 'GetBucketAcl',
    'DescribeAlarms', 'DescribeInstanceInformation', 'ListFindings', 'ReceiveMessage'].includes(eventName);

  const now = new Date('2026-10-03T13:30:00Z');
  const offset = Math.floor(Math.random() * 86400000);
  const timestamp = new Date(now.getTime() - offset);

  return {
    id: `evt-${String(index).padStart(6, '0')}`,
    timestamp: timestamp.toISOString(),
    account: accountNames[acctIdx],
    accountId: accountIds[acctIdx],
    userName: user,
    eventName,
    eventSource: `${service.toLowerCase()}.amazonaws.com`,
    awsService: service,
    sourceIPAddress: randomFrom(sourceIPs),
    awsRegion: randomFrom(regions),
    readOnly: isReadOnly,
    errorCode: isError ? randomFrom(['AccessDenied', 'UnauthorizedAccess', 'ValidationException', 'ThrottlingException', 'ResourceNotFoundException']) : null,
    errorMessage: isError ? 'User is not authorized to perform this operation.' : null,
    userAgent: randomFrom([
      'aws-cli/2.15.0', 'console.amazonaws.com', 'Terraform/1.7.0',
      'Boto3/1.34.0', 'aws-sdk-js/3.500.0', 'CloudFormation',
    ]),
    requestId: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}`,
    resources: service === 'S3'
      ? [{ type: 'AWS::S3::Bucket', name: `my-${randomFrom(['data', 'logs', 'backup', 'assets'])}-bucket` }]
      : service === 'EC2'
        ? [{ type: 'AWS::EC2::Instance', name: `i-${Math.random().toString(16).substring(2, 12)}` }]
        : service === 'Lambda'
          ? [{ type: 'AWS::Lambda::Function', name: `${randomFrom(['process', 'handle', 'transform'])}-${randomFrom(['orders', 'events', 'data'])}` }]
          : [],
    requestParameters: {
      ...(service === 'S3' && { bucketName: `my-${randomFrom(['data', 'logs'])}-bucket` }),
      ...(service === 'EC2' && { instanceType: randomFrom(['t3.micro', 't3.small', 'm5.large', 'c5.xlarge']) }),
      ...(service === 'IAM' && eventName === 'CreateUser' && { userName: 'new-service-user' }),
    },
  };
}

export const cloudTrailEvents = Array.from({ length: 500 }, (_, i) => generateEvent(i))
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export const recentEvents = cloudTrailEvents.slice(0, 20);
