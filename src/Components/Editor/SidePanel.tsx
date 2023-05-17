import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import clsx from 'clsx';
import React from 'react';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { GoSettings } from 'react-icons/go';
import { TiArrowMove } from 'react-icons/ti';

import { EditorModel } from '@utils/models/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '@components/Editor/Utils/Context';

import { ActionMenu } from './SidePanel/Actions';
import { ModelDetailPanel } from './SidePanel/Details/ModelDetail';
import { ModelMetaPanel } from './SidePanel/Meta/ModelMeta';
import { ModelList } from './SidePanel/ModelList';
import { ViewSettings } from './SidePanel/ViewSettings/ViewSettings';

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

    const onModelSelection = (model: EditorModel | null) => {
        setSelectedModel((prev) => {
            if (prev !== null && prev !== model) prev.selected = false;
            if (model !== null && prev !== model) model.selected = true;
            if (model === null || prev !== model) selection.clearSelection();
            return model;
        });
    };

    return (
        <div className="w-[calc(100%-16px)] h-[calc(100%-16px)] flex flex-col items-start shadow-even rounded-lg m-[8px] bg-white">
            <ActionMenu />
            <Allotment separator={false} vertical>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <ModelList
                        models={models}
                        selectedModel={selectedModel}
                        selectModel={onModelSelection}
                    />
                </Allotment.Pane>
                <Allotment.Pane minSize={200} className="flex flex-col border-t border-neutral-100">
                    <Tab.Group>
                        <Tab.List className="flex flex-row bg-white bg-opacity-50 absolute w-full backdrop-blur">
                            <TabButton>
                                <BiMessageSquareDetail className="text-xl w-full" />
                            </TabButton>
                            <TabButton>
                                <TiArrowMove className="text-xl w-full" />
                            </TabButton>
                            <TabButton>
                                <GoSettings className="text-xl w-full" />
                            </TabButton>
                        </Tab.List>
                        <Tab.Panels className="w-full h-full">
                            <TabPanel>
                                <ModelMetaPanel />
                            </TabPanel>
                            <TabPanel>
                                <ModelDetailPanel />
                            </TabPanel>
                            <TabPanel>
                                <ViewSettings />
                            </TabPanel>
                        </Tab.Panels>
                    </Tab.Group>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}

function TabButton(props: { children: React.ReactNode }) {
    const base = 'outline-none p-2 m-2 text-center transition-colors flex-1 rounded';
    return (
        <Tab
            className={({ selected }) =>
                selected
                    ? clsx('text-green-600 bg-green-100 hover:bg-green-200', base)
                    : clsx('text-neutral-600 bg-none hover:bg-neutral-300', base)
            }
        >
            {props.children}
        </Tab>
    );
}

function TabPanel(props: { children: React.ReactNode }) {
    return <Tab.Panel className="overflow-x-auto w-full h-full pt-12">{props.children}</Tab.Panel>;
}
