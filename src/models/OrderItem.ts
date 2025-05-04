/*
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Order, (order) => order.products)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @Column()
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  priceAtPurchase: number;
}
*/