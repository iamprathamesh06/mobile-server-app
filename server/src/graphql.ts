
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class ProductOption {
    limit?: Nullable<number>;
    nutrients?: Nullable<string[]>;
    grains?: Nullable<string[]>;
}

export class CreateUserInput {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export class CreateProductInput {
    name: string;
    description?: Nullable<string>;
    price: number;
    imgUrl: string;
    ingredients: IngredientInput[];
}

export class IngredientInput {
    grain_id: string;
    proportion: number;
}

export class UpdateProductInput {
    _id: string;
    body: CreateProductInput;
}

export class CreateStoreInput {
    address: string;
    latitude: string;
    longitude: string;
    Inventory: Inventory[];
}

export class Inventory {
    grain_id: string;
    quantity: number;
}

export class UpdateStoreInput {
    _id: string;
    body: UpdateStoreInputBody;
}

export class UpdateStoreInputBody {
    address?: Nullable<string>;
    latitude?: Nullable<string>;
    longitude?: Nullable<string>;
    Inventory?: Nullable<Inventory[]>;
}

export class CreateGrainInput {
    name: string;
    type?: Nullable<string>;
    description: string;
    price: number;
    nutrition: string;
    imgUrl?: Nullable<string>;
}

export class UpdateGrainInput {
    name?: Nullable<string>;
    type?: Nullable<string>;
    description?: Nullable<string>;
    price?: Nullable<number>;
    nutrition?: Nullable<string>;
    imgUrl?: Nullable<string>;
    id: string;
}

export class CreateOrderInput {
    user_id: string;
    address: string;
    latitude: string;
    longitude: string;
    contact_info: string;
    product_details: ProductDetailsInput[];
}

export class ProductDetailsInput {
    product_id: string;
    quantity: number;
}

export class UpdateOrderInput {
    _id: string;
    body: UpdateOrderBody;
}

export class UpdateOrderBody {
    user_id?: Nullable<string>;
    address?: Nullable<string>;
    latitude?: Nullable<string>;
    longitude?: Nullable<string>;
    contact_info?: Nullable<string>;
    product_details?: Nullable<ProductDetailsUpdate[]>;
}

export class ProductDetailsUpdate {
    product_id: string;
    quantity: number;
}

export class RegisterResponseDTO {
    name: string;
    id: string;
    email: string;
    role: string;
    creationTime: string;
    emailVerified: boolean;
    isEnabled?: Nullable<boolean>;
}

export class UserDto {
    name?: Nullable<string>;
    email: string;
    id: string;
    emailVerified: boolean;
    phone?: Nullable<string>;
    role: string;
    user_dbid: string;
}

export class ResponseDTO {
    msg?: Nullable<string>;
}

export class Ingredient {
    grain_id: string;
    proportion: string;
}

export class Product {
    _id?: Nullable<string>;
    name: string;
    description?: Nullable<string>;
    price?: Nullable<number>;
    ingredients: Ingredient[];
    imgUrl?: Nullable<string>;
}

export class StoreResponse {
    _id: string;
    address: string;
    latitude: string;
    longitude: string;
    Inventory: InventoryResponse[];
}

export class InventoryResponse {
    grain_id: string;
    quantity: number;
}

export class Grain {
    _id: string;
    name: string;
    description: string;
    type?: Nullable<string>;
    price: number;
    nutrition: string;
    imgUrl?: Nullable<string>;
}

export class Order {
    _id: string;
    user_id: string;
    amount: number;
    address: string;
    latitude?: Nullable<string>;
    longitude?: Nullable<string>;
    transaction_id: string;
    order_status: string[];
    payment_status: string[];
    createdAt: string;
    contact_info: string;
    product_details: ProductDetails[];
}

export class ProductDetails {
    product_id: string;
    quantity: number;
}

export abstract class IQuery {
    abstract me(): UserDto | Promise<UserDto>;

    abstract getProduct(_id: string): Product | Promise<Product>;

    abstract getProducts(options: ProductOption): Product[] | Promise<Product[]>;

    abstract getAllStores(): StoreResponse[] | Promise<StoreResponse[]>;

    abstract getStore(_id: string): StoreResponse | Promise<StoreResponse>;

    abstract grains(): Grain[] | Promise<Grain[]>;

    abstract grain(id: string): Grain | Promise<Grain>;

    abstract getOrders(): Order[] | Promise<Order[]>;

    abstract getUserOrders(user_id: string): Order[] | Promise<Order[]>;

    abstract getOrder(_id: string): Order | Promise<Order>;
}

export abstract class IMutation {
    abstract register(createUser: CreateUserInput): RegisterResponseDTO | Promise<RegisterResponseDTO>;

    abstract verify(): ResponseDTO | Promise<ResponseDTO>;

    abstract forgotPassword(email: string): ResponseDTO | Promise<ResponseDTO>;

    abstract resetPassword(password: string): ResponseDTO | Promise<ResponseDTO>;

    abstract createProduct(create: CreateProductInput): Product | Promise<Product>;

    abstract updateProduct(update: UpdateProductInput): Product | Promise<Product>;

    abstract deleteProduct(_id: string): string | Promise<string>;

    abstract createStore(createStoreInput: CreateStoreInput): StoreResponse | Promise<StoreResponse>;

    abstract updateStore(updateStoreInput: UpdateStoreInput): StoreResponse | Promise<StoreResponse>;

    abstract deleteStore(_id: string): string | Promise<string>;

    abstract createGrain(createGrainInput: CreateGrainInput): Grain | Promise<Grain>;

    abstract updateGrain(updateGrainInput: UpdateGrainInput): Grain | Promise<Grain>;

    abstract removeGrain(id: string): Grain | Promise<Grain>;

    abstract createOrder(createOrderInput: CreateOrderInput): Order | Promise<Order>;

    abstract updateOrder(updateOrderInput: UpdateOrderInput): Order | Promise<Order>;

    abstract deleteOrder(_id: string): string | Promise<string>;
}

type Nullable<T> = T | null;
