import UserModel from '@/model/User';

export async function POST(request: Request) {
  const { username, code } = await request.json();
  console.log('username', username);
  console.log('code', code);
  const decodedUsername = decodeURIComponent(username);
  const user = await UserModel.findOne({ username: decodedUsername });

  if (!user) {
    return Response.json(
      { success: false, message: 'Invalid username' },
      { status: 400 }
    );
  }

  const isCodeValid = user.verifyCode === code;
  const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

  if (isCodeValid && isCodeExpired) {
    user.isVerified = true;
    await user.save();
    return Response.json({ success: true, message: 'Code is valid' });
  } else if (!isCodeValid) {
    return Response.json(
      { success: false, message: 'Invalid code' },
      { status: 400 }
    );
  } else {
    return Response.json(
      {
        success: false,
        message: 'Code is expired, Please sign in again to verify',
      },
      { status: 400 }
    );
  }
}
