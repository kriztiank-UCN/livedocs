"use server"

import { nanoid } from "nanoid"
import { liveblocks } from "../liveblocks"
import { revalidatePath } from "next/cache"
import { parseStringify } from "../utils"

// create a new document/room
export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
  const roomId = nanoid()

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    }

    // level of access for the user
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    }

    // create room from https://liveblocks.io/docs/authentication/id-token/nextjs
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    })

    revalidatePath("/")

    return parseStringify(room)
  } catch (error) {
    console.log(`Error happened while creating a room: ${error}`)
  }
}
