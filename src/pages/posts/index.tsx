import Head from 'next/head';
import { GetStaticProps } from 'next/types';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="">
                        <time>19 de Mai de 2022</time>
                            <strong>Por que participar da NLW?</strong>
                            <p>Um evento de impacto que pode abrir portas para quem busca programar uma rota de sucesso em sua carreira em TI.</p>
                        
                    </a>
                    <a href="">
                        <time>19 de Mai de 2022</time>
                            <strong>Por que participar da NLW?</strong>
                            <p>Um evento de impacto que pode abrir portas para quem busca programar uma rota de sucesso em sua carreira em TI.</p>
                        
                    </a>
                    <a href="">
                        <time>19 de Mai de 2022</time>
                            <strong>Por que participar da NLW?</strong>
                            <p>Um evento de impacto que pode abrir portas para quem busca programar uma rota de sucesso em sua carreira em TI.</p>
                        
                    </a>
                </div>
            </main>
            

        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
    const respondse = await prismic.query([
        Prismic.Predicates.at('document.type', 'posts'),
    ], {
        fetch: ['posts.title', 'posts.content'],
        pageSize: 100,
    }
    )
    console.log(respondse);

    return {
        props:{}
    }
}
