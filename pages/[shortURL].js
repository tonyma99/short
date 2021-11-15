import { connectToDatabase } from "../util/mongodb";

export default function Redirect() {
    return
}

export async function getServerSideProps(context) {
    const { shortURL } = context.query
    const { db } = await connectToDatabase();

    const data = await db.collection('links').findOne({ shortURL: shortURL })
    
    if (data) {
        return {
            redirect: {
                destination: data.fullURL,
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
