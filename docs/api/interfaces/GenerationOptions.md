[@ai16z/eliza v0.1.5-alpha.3](../index.md) / GenerationOptions

# Interface: GenerationOptions

Configuration options for generating objects with a model.

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/generation.ts:1081](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1081)

***

### context

> **context**: `string`

#### Defined in

[packages/core/src/generation.ts:1082](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1082)

***

### modelClass

> **modelClass**: [`ModelClass`](../enumerations/ModelClass.md)

#### Defined in

[packages/core/src/generation.ts:1083](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1083)

***

### schema?

> `optional` **schema**: `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/generation.ts:1084](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1084)

***

### schemaName?

> `optional` **schemaName**: `string`

#### Defined in

[packages/core/src/generation.ts:1085](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1085)

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

#### Defined in

[packages/core/src/generation.ts:1086](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1086)

***

### stop?

> `optional` **stop**: `string`[]

#### Defined in

[packages/core/src/generation.ts:1087](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1087)

***

### mode?

> `optional` **mode**: `"auto"` \| `"json"` \| `"tool"`

#### Defined in

[packages/core/src/generation.ts:1088](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1088)

***

### experimental\_providerMetadata?

> `optional` **experimental\_providerMetadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/core/src/generation.ts:1089](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1089)
