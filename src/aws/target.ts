import Resource from './resource'

export default class Target extends Resource {
  private readonly type = 'AWS::ApplicationAutoScaling::ScalableTarget'

  constructor(
    options: Options,
    private read: boolean,
    private min: number,
    private max: number
  ) { super(options) }

  public toJSON(): any {
    let resource;
      resource = `table/${this.options.table}`;
      if (this.options.index !== '') {
        resource += `/index/${this.options.index}`
      }
    const nameTarget = this.name.target(this.read)
    const nameRole = this.name.role()
    const nameDimension = this.name.dimension(this.read)

    const DependsOn = [this.options.table, nameRole].concat(this.dependencies)

    return {
      [nameTarget]: {
        DependsOn,
        Properties: {
          MaxCapacity: this.max,
          MinCapacity: this.min,
          ResourceId: resource,
          RoleARN: { 'Fn::GetAtt': [nameRole, 'Arn'] },
          ScalableDimension: nameDimension,
          ServiceNamespace: 'dynamodb'
        },
        Type: this.type
      }
    }
  }
}
