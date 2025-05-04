/*
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { Delivery } from "./Delivery";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  products: OrderItem[];

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;

  @OneToOne(() => Delivery)
  @JoinColumn()
  delivery: Delivery;
}
*/