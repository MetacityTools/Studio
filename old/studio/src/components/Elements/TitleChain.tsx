import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

export function TitleChain(props: { categories: string[] }) {
    let { categories } = props;
    return (
        <>
            {categories.map((category, index) => {
                return (
                    <React.Fragment key={index}>
                        <span
                            className="overflow-ellipsis overflow-hidden whitespace-nowrap"
                            title={category}
                        >
                            {category}
                        </span>
                        {index < categories.length - 1 && (
                            <FiChevronRight className="mx-2 text-xs" />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
}
