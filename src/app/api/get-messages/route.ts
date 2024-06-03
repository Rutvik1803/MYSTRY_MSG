import dbConnect from '@/lib/dbConnect';
import { User, getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/model/User';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(user._id); // When we do aggregation, we need to use the ObjectId type
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $unwind: '$messages',
      },
      {
        $sort: { 'messages.createdAt': -1 },
      },
      {
        $group: {
          _id: '$_id',
          messages: { $push: '$messages' },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: 'No messages found',
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        data: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
