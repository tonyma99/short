import { connectToDatabase } from "../util/mongodb";
import { GetServerSideProps } from "next";

export default function Redirect() { }

export const getServerSideProps: GetServerSideProps = async context => {
    const { redirect } = context.query
    const { db } = await connectToDatabase()

    const data = await db.collection('links').findOne({ short: redirect })
    
    if (data) {
        await db.collection('links').updateOne(
            { short: redirect },
            { $inc: { count: 1 }, $push: { clicks: context.req.headers['x-real-ip'] } }
        )
        return {
            redirect: {
                destination: data.full,
                permanent: false
            }
        }
    } else {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
}
