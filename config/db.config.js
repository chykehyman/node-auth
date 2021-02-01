import mongoose from 'mongoose';

export default async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(
      `Database Connection Successful: ${conn.connection.host}`.cyan.underline
        .bold
    );
  } catch (error) {
    console.error(`Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};
