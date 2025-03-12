import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { usePageInfo } from "@bb/components/pageInfo";

export function NotFoundPage() {
	usePageInfo({ breadcrumbs: breadcrumbStrings.notFound });

	return (
		<h1>404: Diese Seite wurde leider nicht gefunden.</h1>
	);
}
