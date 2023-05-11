import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import clsx from 'clsx';
import React from 'react';
import { GoSettings } from 'react-icons/go';
import { IoInformationOutline } from 'react-icons/io5';
import { TiArrowMove } from 'react-icons/ti';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '@components/Editor/Context';

import { Tooltip } from '@elements/Tooltip';

import { ActionMenu } from './SidePanel/Actions';
import { ModelDetailPanel } from './SidePanel/Details/ModelDetail';
import { ModelList } from './SidePanel/ModelList';

export function SidePanel() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { renderer, scene, selectedModel, models, selection, setModels, setSelectedModel } = ctx;

    React.useEffect(() => {
        const onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];
            setModels(copy);

            if (selectedModel !== null && !copy.includes(selectedModel)) {
                setSelectedModel(null);
            }
        };

        scene.onChange = onChange;

        return () => {
            scene.removeChange = onChange;
        };
    }, [scene, selectedModel]);

    React.useEffect(() => {
        renderer.onInit = () => {
            const controls = renderer.window.controls;
            controls.onPick = (m: GL.Pickable) => {
                const model = m as EditorModel;
                onModelSelection(model);
            };
        };
    }, [renderer]);

    React.useEffect(() => {
        console.log('model selection changed', selectedModel);
    }, [selectedModel]);

    const onModelSelection = (model: EditorModel | null) => {
        setSelectedModel((prev) => {
            if (prev !== null && prev !== model) prev.selected = false;
            if (model !== null && prev !== model) model.selected = true;
            if (model === null || prev !== model) selection.clearSelection();
            return model;
        });
    };

    return (
        <div className="text-xs w-full h-full flex flex-col items-start">
            <ActionMenu />
            <Allotment separator={false} vertical>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <ModelList
                        models={models}
                        selectedModel={selectedModel}
                        selectModel={onModelSelection}
                    />
                </Allotment.Pane>
                <Allotment.Pane
                    minSize={200}
                    className="flex flex-row bg-white border-t border-white"
                >
                    <Tab.Group>
                        <Tab.List className="flex flex-col bg-neutral-100/25">
                            <TabButton>
                                <TiArrowMove className="text-2xl w-full" />
                            </TabButton>
                            <TabButton>
                                <IoInformationOutline className="text-2xl w-full" />
                            </TabButton>
                            <TabButton>
                                <GoSettings className="text-2xl w-full" />
                            </TabButton>
                        </Tab.List>
                        <Tab.Panels className="flex-1 bg-neutral-100">
                            <Tab.Panel className="overflow-x-auto w-full h-full">
                                <ModelDetailPanel />
                            </Tab.Panel>
                            <Tab.Panel>TODO</Tab.Panel>
                            <Tab.Panel>TODO</Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}

function TabButton(props: { children: React.ReactNode }) {
    const base = 'outline-none px-4 py-4 text-center';
    return (
        <Tab
            className={({ selected }) =>
                selected
                    ? clsx('bg-neutral-100 text-neutral-600 transition-colors', base)
                    : clsx('text-neutral-400 hover:bg-neutral-200 transition-colors', base)
            }
        >
            {props.children}
        </Tab>
    );
}
