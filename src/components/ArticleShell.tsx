import type { ReactNode } from "react";

type ArticleShellProps = {
  header: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export function ArticleShell({ header, sidebar, footer, children }: ArticleShellProps) {
  return (
    <main className="article-shell">
      <section className="section-shell p-6 sm:p-8">
        {header}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_14rem] xl:grid-cols-[minmax(0,1fr)_15rem]">
          <div>{children}</div>
          {sidebar ? <aside className="space-y-4">{sidebar}</aside> : null}
        </div>
        {footer ? <div className="mt-10">{footer}</div> : null}
      </section>
    </main>
  );
}
