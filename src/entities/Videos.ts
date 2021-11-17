import { Column, Entity } from "typeorm";

@Entity("video", { schema: "nestsolbon" })
export class Video {
  @Column("int", { primary: true, name: "idvideo" })
  idvideo: number;


  @ManyToOne(() => Sections, (sections) => sections.ChannelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ChannelMembers: ChannelMembers[];

}
