
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model FileObject
 * 
 */
export type FileObject = $Result.DefaultSelection<Prisma.$FileObjectPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const FileKind: {
  FILE: 'FILE',
  FOLDER: 'FOLDER'
};

export type FileKind = (typeof FileKind)[keyof typeof FileKind]


export const ReplicationStatus: {
  PENDING: 'PENDING',
  DONE: 'DONE',
  ERROR: 'ERROR'
};

export type ReplicationStatus = (typeof ReplicationStatus)[keyof typeof ReplicationStatus]

}

export type FileKind = $Enums.FileKind

export const FileKind: typeof $Enums.FileKind

export type ReplicationStatus = $Enums.ReplicationStatus

export const ReplicationStatus: typeof $Enums.ReplicationStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more FileObjects
 * const fileObjects = await prisma.fileObject.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more FileObjects
   * const fileObjects = await prisma.fileObject.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.fileObject`: Exposes CRUD operations for the **FileObject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileObjects
    * const fileObjects = await prisma.fileObject.findMany()
    * ```
    */
  get fileObject(): Prisma.FileObjectDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.0
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    FileObject: 'FileObject'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "fileObject"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      FileObject: {
        payload: Prisma.$FileObjectPayload<ExtArgs>
        fields: Prisma.FileObjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileObjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileObjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>
          }
          findFirst: {
            args: Prisma.FileObjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileObjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>
          }
          findMany: {
            args: Prisma.FileObjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>[]
          }
          create: {
            args: Prisma.FileObjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>
          }
          createMany: {
            args: Prisma.FileObjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileObjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>[]
          }
          delete: {
            args: Prisma.FileObjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>
          }
          update: {
            args: Prisma.FileObjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>
          }
          deleteMany: {
            args: Prisma.FileObjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileObjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileObjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>[]
          }
          upsert: {
            args: Prisma.FileObjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileObjectPayload>
          }
          aggregate: {
            args: Prisma.FileObjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileObject>
          }
          groupBy: {
            args: Prisma.FileObjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileObjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileObjectCountArgs<ExtArgs>
            result: $Utils.Optional<FileObjectCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    fileObject?: FileObjectOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model FileObject
   */

  export type AggregateFileObject = {
    _count: FileObjectCountAggregateOutputType | null
    _avg: FileObjectAvgAggregateOutputType | null
    _sum: FileObjectSumAggregateOutputType | null
    _min: FileObjectMinAggregateOutputType | null
    _max: FileObjectMaxAggregateOutputType | null
  }

  export type FileObjectAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type FileObjectSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type FileObjectMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    kind: $Enums.FileKind | null
    folderPath: string | null
    originalName: string | null
    storedName: string | null
    localPath: string | null
    mimeType: string | null
    sizeBytes: number | null
    cloudKey: string | null
    replicationStatus: $Enums.ReplicationStatus | null
    replicationError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileObjectMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    kind: $Enums.FileKind | null
    folderPath: string | null
    originalName: string | null
    storedName: string | null
    localPath: string | null
    mimeType: string | null
    sizeBytes: number | null
    cloudKey: string | null
    replicationStatus: $Enums.ReplicationStatus | null
    replicationError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileObjectCountAggregateOutputType = {
    id: number
    ownerId: number
    kind: number
    folderPath: number
    originalName: number
    storedName: number
    localPath: number
    mimeType: number
    sizeBytes: number
    cloudKey: number
    replicationStatus: number
    replicationError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FileObjectAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type FileObjectSumAggregateInputType = {
    sizeBytes?: true
  }

  export type FileObjectMinAggregateInputType = {
    id?: true
    ownerId?: true
    kind?: true
    folderPath?: true
    originalName?: true
    storedName?: true
    localPath?: true
    mimeType?: true
    sizeBytes?: true
    cloudKey?: true
    replicationStatus?: true
    replicationError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileObjectMaxAggregateInputType = {
    id?: true
    ownerId?: true
    kind?: true
    folderPath?: true
    originalName?: true
    storedName?: true
    localPath?: true
    mimeType?: true
    sizeBytes?: true
    cloudKey?: true
    replicationStatus?: true
    replicationError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileObjectCountAggregateInputType = {
    id?: true
    ownerId?: true
    kind?: true
    folderPath?: true
    originalName?: true
    storedName?: true
    localPath?: true
    mimeType?: true
    sizeBytes?: true
    cloudKey?: true
    replicationStatus?: true
    replicationError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FileObjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileObject to aggregate.
     */
    where?: FileObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileObjects to fetch.
     */
    orderBy?: FileObjectOrderByWithRelationInput | FileObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileObjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileObjects
    **/
    _count?: true | FileObjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileObjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileObjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileObjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileObjectMaxAggregateInputType
  }

  export type GetFileObjectAggregateType<T extends FileObjectAggregateArgs> = {
        [P in keyof T & keyof AggregateFileObject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileObject[P]>
      : GetScalarType<T[P], AggregateFileObject[P]>
  }




  export type FileObjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileObjectWhereInput
    orderBy?: FileObjectOrderByWithAggregationInput | FileObjectOrderByWithAggregationInput[]
    by: FileObjectScalarFieldEnum[] | FileObjectScalarFieldEnum
    having?: FileObjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileObjectCountAggregateInputType | true
    _avg?: FileObjectAvgAggregateInputType
    _sum?: FileObjectSumAggregateInputType
    _min?: FileObjectMinAggregateInputType
    _max?: FileObjectMaxAggregateInputType
  }

  export type FileObjectGroupByOutputType = {
    id: string
    ownerId: string
    kind: $Enums.FileKind
    folderPath: string
    originalName: string
    storedName: string
    localPath: string
    mimeType: string
    sizeBytes: number
    cloudKey: string | null
    replicationStatus: $Enums.ReplicationStatus
    replicationError: string | null
    createdAt: Date
    updatedAt: Date
    _count: FileObjectCountAggregateOutputType | null
    _avg: FileObjectAvgAggregateOutputType | null
    _sum: FileObjectSumAggregateOutputType | null
    _min: FileObjectMinAggregateOutputType | null
    _max: FileObjectMaxAggregateOutputType | null
  }

  type GetFileObjectGroupByPayload<T extends FileObjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileObjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileObjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileObjectGroupByOutputType[P]>
            : GetScalarType<T[P], FileObjectGroupByOutputType[P]>
        }
      >
    >


  export type FileObjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    kind?: boolean
    folderPath?: boolean
    originalName?: boolean
    storedName?: boolean
    localPath?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    cloudKey?: boolean
    replicationStatus?: boolean
    replicationError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fileObject"]>

  export type FileObjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    kind?: boolean
    folderPath?: boolean
    originalName?: boolean
    storedName?: boolean
    localPath?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    cloudKey?: boolean
    replicationStatus?: boolean
    replicationError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fileObject"]>

  export type FileObjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    kind?: boolean
    folderPath?: boolean
    originalName?: boolean
    storedName?: boolean
    localPath?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    cloudKey?: boolean
    replicationStatus?: boolean
    replicationError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["fileObject"]>

  export type FileObjectSelectScalar = {
    id?: boolean
    ownerId?: boolean
    kind?: boolean
    folderPath?: boolean
    originalName?: boolean
    storedName?: boolean
    localPath?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    cloudKey?: boolean
    replicationStatus?: boolean
    replicationError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FileObjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ownerId" | "kind" | "folderPath" | "originalName" | "storedName" | "localPath" | "mimeType" | "sizeBytes" | "cloudKey" | "replicationStatus" | "replicationError" | "createdAt" | "updatedAt", ExtArgs["result"]["fileObject"]>

  export type $FileObjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileObject"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      kind: $Enums.FileKind
      folderPath: string
      originalName: string
      storedName: string
      localPath: string
      mimeType: string
      sizeBytes: number
      cloudKey: string | null
      replicationStatus: $Enums.ReplicationStatus
      replicationError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fileObject"]>
    composites: {}
  }

  type FileObjectGetPayload<S extends boolean | null | undefined | FileObjectDefaultArgs> = $Result.GetResult<Prisma.$FileObjectPayload, S>

  type FileObjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileObjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileObjectCountAggregateInputType | true
    }

  export interface FileObjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileObject'], meta: { name: 'FileObject' } }
    /**
     * Find zero or one FileObject that matches the filter.
     * @param {FileObjectFindUniqueArgs} args - Arguments to find a FileObject
     * @example
     * // Get one FileObject
     * const fileObject = await prisma.fileObject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileObjectFindUniqueArgs>(args: SelectSubset<T, FileObjectFindUniqueArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FileObject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileObjectFindUniqueOrThrowArgs} args - Arguments to find a FileObject
     * @example
     * // Get one FileObject
     * const fileObject = await prisma.fileObject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileObjectFindUniqueOrThrowArgs>(args: SelectSubset<T, FileObjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileObject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileObjectFindFirstArgs} args - Arguments to find a FileObject
     * @example
     * // Get one FileObject
     * const fileObject = await prisma.fileObject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileObjectFindFirstArgs>(args?: SelectSubset<T, FileObjectFindFirstArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileObject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileObjectFindFirstOrThrowArgs} args - Arguments to find a FileObject
     * @example
     * // Get one FileObject
     * const fileObject = await prisma.fileObject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileObjectFindFirstOrThrowArgs>(args?: SelectSubset<T, FileObjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FileObjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileObjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileObjects
     * const fileObjects = await prisma.fileObject.findMany()
     * 
     * // Get first 10 FileObjects
     * const fileObjects = await prisma.fileObject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileObjectWithIdOnly = await prisma.fileObject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileObjectFindManyArgs>(args?: SelectSubset<T, FileObjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FileObject.
     * @param {FileObjectCreateArgs} args - Arguments to create a FileObject.
     * @example
     * // Create one FileObject
     * const FileObject = await prisma.fileObject.create({
     *   data: {
     *     // ... data to create a FileObject
     *   }
     * })
     * 
     */
    create<T extends FileObjectCreateArgs>(args: SelectSubset<T, FileObjectCreateArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FileObjects.
     * @param {FileObjectCreateManyArgs} args - Arguments to create many FileObjects.
     * @example
     * // Create many FileObjects
     * const fileObject = await prisma.fileObject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileObjectCreateManyArgs>(args?: SelectSubset<T, FileObjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileObjects and returns the data saved in the database.
     * @param {FileObjectCreateManyAndReturnArgs} args - Arguments to create many FileObjects.
     * @example
     * // Create many FileObjects
     * const fileObject = await prisma.fileObject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileObjects and only return the `id`
     * const fileObjectWithIdOnly = await prisma.fileObject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileObjectCreateManyAndReturnArgs>(args?: SelectSubset<T, FileObjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FileObject.
     * @param {FileObjectDeleteArgs} args - Arguments to delete one FileObject.
     * @example
     * // Delete one FileObject
     * const FileObject = await prisma.fileObject.delete({
     *   where: {
     *     // ... filter to delete one FileObject
     *   }
     * })
     * 
     */
    delete<T extends FileObjectDeleteArgs>(args: SelectSubset<T, FileObjectDeleteArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FileObject.
     * @param {FileObjectUpdateArgs} args - Arguments to update one FileObject.
     * @example
     * // Update one FileObject
     * const fileObject = await prisma.fileObject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileObjectUpdateArgs>(args: SelectSubset<T, FileObjectUpdateArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FileObjects.
     * @param {FileObjectDeleteManyArgs} args - Arguments to filter FileObjects to delete.
     * @example
     * // Delete a few FileObjects
     * const { count } = await prisma.fileObject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileObjectDeleteManyArgs>(args?: SelectSubset<T, FileObjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileObjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileObjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileObjects
     * const fileObject = await prisma.fileObject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileObjectUpdateManyArgs>(args: SelectSubset<T, FileObjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileObjects and returns the data updated in the database.
     * @param {FileObjectUpdateManyAndReturnArgs} args - Arguments to update many FileObjects.
     * @example
     * // Update many FileObjects
     * const fileObject = await prisma.fileObject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FileObjects and only return the `id`
     * const fileObjectWithIdOnly = await prisma.fileObject.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FileObjectUpdateManyAndReturnArgs>(args: SelectSubset<T, FileObjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FileObject.
     * @param {FileObjectUpsertArgs} args - Arguments to update or create a FileObject.
     * @example
     * // Update or create a FileObject
     * const fileObject = await prisma.fileObject.upsert({
     *   create: {
     *     // ... data to create a FileObject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileObject we want to update
     *   }
     * })
     */
    upsert<T extends FileObjectUpsertArgs>(args: SelectSubset<T, FileObjectUpsertArgs<ExtArgs>>): Prisma__FileObjectClient<$Result.GetResult<Prisma.$FileObjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FileObjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileObjectCountArgs} args - Arguments to filter FileObjects to count.
     * @example
     * // Count the number of FileObjects
     * const count = await prisma.fileObject.count({
     *   where: {
     *     // ... the filter for the FileObjects we want to count
     *   }
     * })
    **/
    count<T extends FileObjectCountArgs>(
      args?: Subset<T, FileObjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileObjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileObject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileObjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileObjectAggregateArgs>(args: Subset<T, FileObjectAggregateArgs>): Prisma.PrismaPromise<GetFileObjectAggregateType<T>>

    /**
     * Group by FileObject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileObjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileObjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileObjectGroupByArgs['orderBy'] }
        : { orderBy?: FileObjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileObjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileObjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileObject model
   */
  readonly fields: FileObjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileObject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileObjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileObject model
   */
  interface FileObjectFieldRefs {
    readonly id: FieldRef<"FileObject", 'String'>
    readonly ownerId: FieldRef<"FileObject", 'String'>
    readonly kind: FieldRef<"FileObject", 'FileKind'>
    readonly folderPath: FieldRef<"FileObject", 'String'>
    readonly originalName: FieldRef<"FileObject", 'String'>
    readonly storedName: FieldRef<"FileObject", 'String'>
    readonly localPath: FieldRef<"FileObject", 'String'>
    readonly mimeType: FieldRef<"FileObject", 'String'>
    readonly sizeBytes: FieldRef<"FileObject", 'Int'>
    readonly cloudKey: FieldRef<"FileObject", 'String'>
    readonly replicationStatus: FieldRef<"FileObject", 'ReplicationStatus'>
    readonly replicationError: FieldRef<"FileObject", 'String'>
    readonly createdAt: FieldRef<"FileObject", 'DateTime'>
    readonly updatedAt: FieldRef<"FileObject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileObject findUnique
   */
  export type FileObjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * Filter, which FileObject to fetch.
     */
    where: FileObjectWhereUniqueInput
  }

  /**
   * FileObject findUniqueOrThrow
   */
  export type FileObjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * Filter, which FileObject to fetch.
     */
    where: FileObjectWhereUniqueInput
  }

  /**
   * FileObject findFirst
   */
  export type FileObjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * Filter, which FileObject to fetch.
     */
    where?: FileObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileObjects to fetch.
     */
    orderBy?: FileObjectOrderByWithRelationInput | FileObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileObjects.
     */
    cursor?: FileObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileObjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileObjects.
     */
    distinct?: FileObjectScalarFieldEnum | FileObjectScalarFieldEnum[]
  }

  /**
   * FileObject findFirstOrThrow
   */
  export type FileObjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * Filter, which FileObject to fetch.
     */
    where?: FileObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileObjects to fetch.
     */
    orderBy?: FileObjectOrderByWithRelationInput | FileObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileObjects.
     */
    cursor?: FileObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileObjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileObjects.
     */
    distinct?: FileObjectScalarFieldEnum | FileObjectScalarFieldEnum[]
  }

  /**
   * FileObject findMany
   */
  export type FileObjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * Filter, which FileObjects to fetch.
     */
    where?: FileObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileObjects to fetch.
     */
    orderBy?: FileObjectOrderByWithRelationInput | FileObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileObjects.
     */
    cursor?: FileObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileObjects.
     */
    skip?: number
    distinct?: FileObjectScalarFieldEnum | FileObjectScalarFieldEnum[]
  }

  /**
   * FileObject create
   */
  export type FileObjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * The data needed to create a FileObject.
     */
    data: XOR<FileObjectCreateInput, FileObjectUncheckedCreateInput>
  }

  /**
   * FileObject createMany
   */
  export type FileObjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileObjects.
     */
    data: FileObjectCreateManyInput | FileObjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileObject createManyAndReturn
   */
  export type FileObjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * The data used to create many FileObjects.
     */
    data: FileObjectCreateManyInput | FileObjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileObject update
   */
  export type FileObjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * The data needed to update a FileObject.
     */
    data: XOR<FileObjectUpdateInput, FileObjectUncheckedUpdateInput>
    /**
     * Choose, which FileObject to update.
     */
    where: FileObjectWhereUniqueInput
  }

  /**
   * FileObject updateMany
   */
  export type FileObjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileObjects.
     */
    data: XOR<FileObjectUpdateManyMutationInput, FileObjectUncheckedUpdateManyInput>
    /**
     * Filter which FileObjects to update
     */
    where?: FileObjectWhereInput
    /**
     * Limit how many FileObjects to update.
     */
    limit?: number
  }

  /**
   * FileObject updateManyAndReturn
   */
  export type FileObjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * The data used to update FileObjects.
     */
    data: XOR<FileObjectUpdateManyMutationInput, FileObjectUncheckedUpdateManyInput>
    /**
     * Filter which FileObjects to update
     */
    where?: FileObjectWhereInput
    /**
     * Limit how many FileObjects to update.
     */
    limit?: number
  }

  /**
   * FileObject upsert
   */
  export type FileObjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * The filter to search for the FileObject to update in case it exists.
     */
    where: FileObjectWhereUniqueInput
    /**
     * In case the FileObject found by the `where` argument doesn't exist, create a new FileObject with this data.
     */
    create: XOR<FileObjectCreateInput, FileObjectUncheckedCreateInput>
    /**
     * In case the FileObject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileObjectUpdateInput, FileObjectUncheckedUpdateInput>
  }

  /**
   * FileObject delete
   */
  export type FileObjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
    /**
     * Filter which FileObject to delete.
     */
    where: FileObjectWhereUniqueInput
  }

  /**
   * FileObject deleteMany
   */
  export type FileObjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileObjects to delete
     */
    where?: FileObjectWhereInput
    /**
     * Limit how many FileObjects to delete.
     */
    limit?: number
  }

  /**
   * FileObject without action
   */
  export type FileObjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileObject
     */
    select?: FileObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileObject
     */
    omit?: FileObjectOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FileObjectScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    kind: 'kind',
    folderPath: 'folderPath',
    originalName: 'originalName',
    storedName: 'storedName',
    localPath: 'localPath',
    mimeType: 'mimeType',
    sizeBytes: 'sizeBytes',
    cloudKey: 'cloudKey',
    replicationStatus: 'replicationStatus',
    replicationError: 'replicationError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FileObjectScalarFieldEnum = (typeof FileObjectScalarFieldEnum)[keyof typeof FileObjectScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'FileKind'
   */
  export type EnumFileKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileKind'>
    


  /**
   * Reference to a field of type 'FileKind[]'
   */
  export type ListEnumFileKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileKind[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ReplicationStatus'
   */
  export type EnumReplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReplicationStatus'>
    


  /**
   * Reference to a field of type 'ReplicationStatus[]'
   */
  export type ListEnumReplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReplicationStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type FileObjectWhereInput = {
    AND?: FileObjectWhereInput | FileObjectWhereInput[]
    OR?: FileObjectWhereInput[]
    NOT?: FileObjectWhereInput | FileObjectWhereInput[]
    id?: StringFilter<"FileObject"> | string
    ownerId?: StringFilter<"FileObject"> | string
    kind?: EnumFileKindFilter<"FileObject"> | $Enums.FileKind
    folderPath?: StringFilter<"FileObject"> | string
    originalName?: StringFilter<"FileObject"> | string
    storedName?: StringFilter<"FileObject"> | string
    localPath?: StringFilter<"FileObject"> | string
    mimeType?: StringFilter<"FileObject"> | string
    sizeBytes?: IntFilter<"FileObject"> | number
    cloudKey?: StringNullableFilter<"FileObject"> | string | null
    replicationStatus?: EnumReplicationStatusFilter<"FileObject"> | $Enums.ReplicationStatus
    replicationError?: StringNullableFilter<"FileObject"> | string | null
    createdAt?: DateTimeFilter<"FileObject"> | Date | string
    updatedAt?: DateTimeFilter<"FileObject"> | Date | string
  }

  export type FileObjectOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    kind?: SortOrder
    folderPath?: SortOrder
    originalName?: SortOrder
    storedName?: SortOrder
    localPath?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    cloudKey?: SortOrderInput | SortOrder
    replicationStatus?: SortOrder
    replicationError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileObjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileObjectWhereInput | FileObjectWhereInput[]
    OR?: FileObjectWhereInput[]
    NOT?: FileObjectWhereInput | FileObjectWhereInput[]
    ownerId?: StringFilter<"FileObject"> | string
    kind?: EnumFileKindFilter<"FileObject"> | $Enums.FileKind
    folderPath?: StringFilter<"FileObject"> | string
    originalName?: StringFilter<"FileObject"> | string
    storedName?: StringFilter<"FileObject"> | string
    localPath?: StringFilter<"FileObject"> | string
    mimeType?: StringFilter<"FileObject"> | string
    sizeBytes?: IntFilter<"FileObject"> | number
    cloudKey?: StringNullableFilter<"FileObject"> | string | null
    replicationStatus?: EnumReplicationStatusFilter<"FileObject"> | $Enums.ReplicationStatus
    replicationError?: StringNullableFilter<"FileObject"> | string | null
    createdAt?: DateTimeFilter<"FileObject"> | Date | string
    updatedAt?: DateTimeFilter<"FileObject"> | Date | string
  }, "id">

  export type FileObjectOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    kind?: SortOrder
    folderPath?: SortOrder
    originalName?: SortOrder
    storedName?: SortOrder
    localPath?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    cloudKey?: SortOrderInput | SortOrder
    replicationStatus?: SortOrder
    replicationError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FileObjectCountOrderByAggregateInput
    _avg?: FileObjectAvgOrderByAggregateInput
    _max?: FileObjectMaxOrderByAggregateInput
    _min?: FileObjectMinOrderByAggregateInput
    _sum?: FileObjectSumOrderByAggregateInput
  }

  export type FileObjectScalarWhereWithAggregatesInput = {
    AND?: FileObjectScalarWhereWithAggregatesInput | FileObjectScalarWhereWithAggregatesInput[]
    OR?: FileObjectScalarWhereWithAggregatesInput[]
    NOT?: FileObjectScalarWhereWithAggregatesInput | FileObjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileObject"> | string
    ownerId?: StringWithAggregatesFilter<"FileObject"> | string
    kind?: EnumFileKindWithAggregatesFilter<"FileObject"> | $Enums.FileKind
    folderPath?: StringWithAggregatesFilter<"FileObject"> | string
    originalName?: StringWithAggregatesFilter<"FileObject"> | string
    storedName?: StringWithAggregatesFilter<"FileObject"> | string
    localPath?: StringWithAggregatesFilter<"FileObject"> | string
    mimeType?: StringWithAggregatesFilter<"FileObject"> | string
    sizeBytes?: IntWithAggregatesFilter<"FileObject"> | number
    cloudKey?: StringNullableWithAggregatesFilter<"FileObject"> | string | null
    replicationStatus?: EnumReplicationStatusWithAggregatesFilter<"FileObject"> | $Enums.ReplicationStatus
    replicationError?: StringNullableWithAggregatesFilter<"FileObject"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FileObject"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FileObject"> | Date | string
  }

  export type FileObjectCreateInput = {
    id?: string
    ownerId: string
    kind: $Enums.FileKind
    folderPath: string
    originalName: string
    storedName: string
    localPath: string
    mimeType: string
    sizeBytes: number
    cloudKey?: string | null
    replicationStatus?: $Enums.ReplicationStatus
    replicationError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileObjectUncheckedCreateInput = {
    id?: string
    ownerId: string
    kind: $Enums.FileKind
    folderPath: string
    originalName: string
    storedName: string
    localPath: string
    mimeType: string
    sizeBytes: number
    cloudKey?: string | null
    replicationStatus?: $Enums.ReplicationStatus
    replicationError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileObjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    kind?: EnumFileKindFieldUpdateOperationsInput | $Enums.FileKind
    folderPath?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedName?: StringFieldUpdateOperationsInput | string
    localPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    cloudKey?: NullableStringFieldUpdateOperationsInput | string | null
    replicationStatus?: EnumReplicationStatusFieldUpdateOperationsInput | $Enums.ReplicationStatus
    replicationError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileObjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    kind?: EnumFileKindFieldUpdateOperationsInput | $Enums.FileKind
    folderPath?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedName?: StringFieldUpdateOperationsInput | string
    localPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    cloudKey?: NullableStringFieldUpdateOperationsInput | string | null
    replicationStatus?: EnumReplicationStatusFieldUpdateOperationsInput | $Enums.ReplicationStatus
    replicationError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileObjectCreateManyInput = {
    id?: string
    ownerId: string
    kind: $Enums.FileKind
    folderPath: string
    originalName: string
    storedName: string
    localPath: string
    mimeType: string
    sizeBytes: number
    cloudKey?: string | null
    replicationStatus?: $Enums.ReplicationStatus
    replicationError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileObjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    kind?: EnumFileKindFieldUpdateOperationsInput | $Enums.FileKind
    folderPath?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedName?: StringFieldUpdateOperationsInput | string
    localPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    cloudKey?: NullableStringFieldUpdateOperationsInput | string | null
    replicationStatus?: EnumReplicationStatusFieldUpdateOperationsInput | $Enums.ReplicationStatus
    replicationError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileObjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    kind?: EnumFileKindFieldUpdateOperationsInput | $Enums.FileKind
    folderPath?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedName?: StringFieldUpdateOperationsInput | string
    localPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    cloudKey?: NullableStringFieldUpdateOperationsInput | string | null
    replicationStatus?: EnumReplicationStatusFieldUpdateOperationsInput | $Enums.ReplicationStatus
    replicationError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumFileKindFilter<$PrismaModel = never> = {
    equals?: $Enums.FileKind | EnumFileKindFieldRefInput<$PrismaModel>
    in?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    not?: NestedEnumFileKindFilter<$PrismaModel> | $Enums.FileKind
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumReplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReplicationStatus | EnumReplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReplicationStatusFilter<$PrismaModel> | $Enums.ReplicationStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FileObjectCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    kind?: SortOrder
    folderPath?: SortOrder
    originalName?: SortOrder
    storedName?: SortOrder
    localPath?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    cloudKey?: SortOrder
    replicationStatus?: SortOrder
    replicationError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileObjectAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type FileObjectMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    kind?: SortOrder
    folderPath?: SortOrder
    originalName?: SortOrder
    storedName?: SortOrder
    localPath?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    cloudKey?: SortOrder
    replicationStatus?: SortOrder
    replicationError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileObjectMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    kind?: SortOrder
    folderPath?: SortOrder
    originalName?: SortOrder
    storedName?: SortOrder
    localPath?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    cloudKey?: SortOrder
    replicationStatus?: SortOrder
    replicationError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileObjectSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumFileKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileKind | EnumFileKindFieldRefInput<$PrismaModel>
    in?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    not?: NestedEnumFileKindWithAggregatesFilter<$PrismaModel> | $Enums.FileKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileKindFilter<$PrismaModel>
    _max?: NestedEnumFileKindFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumReplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReplicationStatus | EnumReplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumReplicationStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumFileKindFieldUpdateOperationsInput = {
    set?: $Enums.FileKind
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumReplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReplicationStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumFileKindFilter<$PrismaModel = never> = {
    equals?: $Enums.FileKind | EnumFileKindFieldRefInput<$PrismaModel>
    in?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    not?: NestedEnumFileKindFilter<$PrismaModel> | $Enums.FileKind
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumReplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReplicationStatus | EnumReplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReplicationStatusFilter<$PrismaModel> | $Enums.ReplicationStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumFileKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileKind | EnumFileKindFieldRefInput<$PrismaModel>
    in?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileKind[] | ListEnumFileKindFieldRefInput<$PrismaModel>
    not?: NestedEnumFileKindWithAggregatesFilter<$PrismaModel> | $Enums.FileKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileKindFilter<$PrismaModel>
    _max?: NestedEnumFileKindFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumReplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReplicationStatus | EnumReplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReplicationStatus[] | ListEnumReplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumReplicationStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}