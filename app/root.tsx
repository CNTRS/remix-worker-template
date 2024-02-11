import type { MetaFunction } from '@remix-run/cloudflare';
import * as React from 'react';
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	json,
	useLoaderData,
	useRouteError,
} from '@remix-run/react';
import '~/styles.css';
import { metadata } from './services/github.server';
import { RemixLogo } from './components';

// We will rollback to loading CSS through links when `.css?url` is supported
// export const links: LinksFunction = () => {
//   return [{ rel: 'stylesheet', href: stylesUrl }];
// };

export const meta: MetaFunction = () => {
	return [
		{
			charset: 'utf-8',
			title: 'remix-cloudlfare-template',
			viewport: 'width=device-width,initial-scale=1',
		},
	];
};

export function loader() {
	return json({
		repo: metadata.repo,
		owner: metadata.owner,
		description: '📜 All-in-one remix starter template for Cloudflare Pages',
	});
}

export default function App() {
	const { repo, owner, description } = useLoaderData<typeof loader>();
	return (
		<Document>
			<Layout
				title={repo}
				description={description}
				actionText="GitHub Repository"
				actionLink={`https://github.com/${owner}/${repo}`}
			>
				<Outlet />
			</Layout>
		</Document>
	);
}

function Document({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				{title ? <title>{title}</title> : null}
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

function Layout({
	children,
	title,
	description,
	actionText,
	actionLink,
}: {
	children?: React.ReactNode;
	title?: string;
	description?: string;
	actionText?: string;
	actionLink?: string;
}) {
	return (
		<div className="container mx-auto">
			<div className="flex flex-col-reverse lg:flex-row">
				<section className="flex-1 relative border-t lg:border-t-0">
					<div className="sticky top-0">
						<div className="flex flex-col lg:min-h-screen lg:py-10 px-5 py-5">
							<header className="py-4">
								<Link to="/" title="Remix">
									<RemixLogo />
								</Link>
							</header>
							<div className="flex-1 py-5 lg:py-20">
								<h2 className="text-xl">{title}</h2>
								<p className="py-2">{description}</p>
								{actionText ? (
									<a
										className="inline-block border hover:border-black px-4 py-2 mt-2"
										href={actionLink ?? '#'}
									>
										{actionText}
									</a>
								) : null}
							</div>
							<footer>
								Wanna know more about Remix? Check out{' '}
								<a className="underline" href="https://remix.guide">
									Remix Guide
								</a>
							</footer>
						</div>
					</div>
				</section>
				<main className="flex-1">
					<div className="lg:py-10 px-5 py-5">{children}</div>
				</main>
			</div>
		</div>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	// Log the error to the console
	console.error(error);

	if (isRouteErrorResponse(error)) {
		const title = `${error.status} ${error.statusText}`;

		let message;
		switch (error.status) {
			case 401:
				message =
					'Oops! Looks like you tried to visit a page that you do not have access to.';
				break;
			case 404:
				message =
					'Oops! Looks like you tried to visit a page that does not exist.';
				break;
			default:
				throw new Error(error.data || error.statusText);
		}

		return (
			<Document title={title}>
				<Layout title={title} description={message} />
			</Document>
		);
	}

	return (
		<Document title="Error!">
			<Layout title="There was an error" description={`${error}`} />
		</Document>
	);
}
