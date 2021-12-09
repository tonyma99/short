import { connectToDatabase } from "../util/mongodb";

export default function Redirect() { }

export async function getServerSideProps(context) {
    const { redirect } = context.query
    const { db } = await connectToDatabase();

    const data = await db.collection('links').findOne({ shortUrl: redirect })
    
    if (data) {
        return {
            redirect: {
                destination: data.fullUrl,
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
