/*
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Delivery } from "./Delivery";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @OneToMany(() => Delivery, (delivery) => delivery.address)
  deliveries: Delivery[];

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
*/
