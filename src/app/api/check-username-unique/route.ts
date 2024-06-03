import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { userNameValidation } from '@/schemas/signUpSchema';

const checkUsernameUnique = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    // First try to extract username of url query params
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get('username'), // there can be multiple params so we created an object
    };

    //validate with zod
    const result = checkUsernameUnique.safeParse(queryParam);

    if (!result.success) {
      const userNameError = result.error.format()._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameError?.length > 0
              ? userNameError.join(',')
              : 'Invalid username',
        },
        { status: 400 }
      );
    }
    const { username } = result.data;

    const exisitngVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exisitngVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username already exists',
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}
