import Head from 'next/head'

export default function StaticPage({ message, title, content, posts }) {
  console.log(posts)
  posts && posts != null 
    return (
      <div>
        <Head>
            <title>{title? title : "Create React App"}</title>
            <meta name="description" content={content} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <section className="container" > 
            <div className='blogposts card border-0'>
              <h1 className='card card-title border-0'>
              { posts[0].title}
              </h1>

              <p className='card card-body border-0' >
                {posts[0].brief}
              </p>

              <a className='btn btn-primary w-25' href={`https://kenny-io.hashnode.dev/${posts[0].slug}`}>Read more...</a>
                
            </div>
        </section>
      </div>
    );
  }
  
  export async function getStaticProps() {
    async function gql(query, variables={}) {
        const data = await fetch('https://api.hashnode.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
    
        return data.json();
    }

    const query = `
      query {
        user(username: "Ekeneeze") {
          name
          publication {
            posts {
              slug
              title
              brief
            }
          }
        }
      }
    `

    const hashnodeData = await gql(query)

    const {posts} = hashnodeData.data.user.publication

    console.log(posts)

    return {
      props: {
        message: "This is a static page — and now this is a prop!",
        title: 'This is a prop',
        content: 'this is a static content',
        posts
      },
    };
  }