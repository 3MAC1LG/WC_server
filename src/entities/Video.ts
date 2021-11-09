import { Column, Entity } from "typeorm";

@Entity("video", { schema: "nestsolbon" })
export class Video {
  @Column("int", { primary: true, name: "idvideo" })
  idvideo: number;
}
