/*
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Address } from "./Address";
import { Order } from "./Order";

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Address, (address) => address.deliveries)
  address: Address;

  @Column("decimal", { precision: 10, scale: 2 })
  fee: number;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;
}
*/