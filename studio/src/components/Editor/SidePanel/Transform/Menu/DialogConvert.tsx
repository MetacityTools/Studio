import { Dialog } from '@headlessui/react';
import {
    TbSquareRoundedNumber1Filled,
    TbSquareRoundedNumber2Filled,
    TbSquareRoundedNumber3Filled,
} from 'react-icons/tb';

import { OverlayDialog } from '@elements/Dialog';

export function ConvertDialog(props: { isOpen: boolean; onClose: (run: boolean) => void }) {
    const { isOpen, onClose } = props;

    return (
        <OverlayDialog isOpen={isOpen} onClose={() => props.onClose(false)}>
            <Dialog.Title
                as="h1"
                className="text-2xl font-medium leading-6 text-gray-900 mx-6 mt-6"
            >
                Convert Models
            </Dialog.Title>
            <div className="py-2 px-6 leading-normal text-sm mt-2">
                Convert imported models and proceed to connecting metadata.{' '}
                <span className="text-blue-500">
                    You won't be able to modify the imported geometry after conversion.
                </span>
            </div>
            <div className="mx-6 my-2">
                <div className="flex flex-row items-center">
                    <TbSquareRoundedNumber1Filled className="mr-2 text-xl text-blue-500" />
                    import, transform, and align models
                </div>
                <div className="border-l ml-2 pl-5 border-blue-500 border-dashed"></div>
                <div className="border-l h-4 ml-2 border-blue-500 border-dashed"></div>
                <div className="flex flex-row items-center">
                    <TbSquareRoundedNumber2Filled className="mr-2 text-xl text-blue-500" />
                    connect metadata data
                </div>
                <div className="border-l ml-2 pl-5 border-neutral-500 border-dashed">
                    <ul className="list-disc list-inside text-sm py-2">
                        <li>group models and groups of models</li>
                        <li>connect geometry and metadata</li>
                    </ul>
                </div>
                <div className="flex flex-row items-center">
                    <TbSquareRoundedNumber3Filled className="mr-2 text-xl text-neutral-500" />
                    export
                </div>
            </div>

            <div className="m-6 mt-8">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => props.onClose(true)}
                >
                    Let's do it!
                </button>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 ml-2"
                    onClick={() => props.onClose(false)}
                >
                    Cancel
                </button>
            </div>
        </OverlayDialog>
    );
}
