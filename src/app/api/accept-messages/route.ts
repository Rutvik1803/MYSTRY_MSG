import dbConnect from '@/lib/dbConnect';
import { User, getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'User preferences updated',
        data: updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Error updating user preferences',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        data: foundUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Error getting user preferences',
      },
      {
        status: 500,
      }
    );
  }
}
