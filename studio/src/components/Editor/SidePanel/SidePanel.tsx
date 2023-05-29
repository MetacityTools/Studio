import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { GoSettings } from 'react-icons/go';
import { TiArrowMove } from 'react-icons/ti';

import { EditingStage, EditorContext } from '@editor/Context';

import { TabButton, TabPanel } from '@elements/Tabs';

import { ActionMenu } from './Actions/Actions';
import { HierarchyPanel } from './Hierarchy/HierarchyPanel';
import { ModelList } from './ModelList/ModelList';
import { ModelMetaPanel } from './PanelMeta/ModelMeta';
import { ModelTransformPanel } from './PanelTransform/ModelTransform';
import { ViewSettings } from './PanelViewSettings/ViewSettings';

function TransformSidePanel() {
    return (
        <>
            <ActionMenu />
            <Allotment separator={false} vertical>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <ModelList />
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
                                <ModelTransformPanel />
                            </TabPanel>
                            <TabPanel>
                                <ViewSettings />
                            </TabPanel>
                        </Tab.Panels>
                    </Tab.Group>
                </Allotment.Pane>
            </Allotment>
        </>
    );
}

function AnnotateSidePanel() {
    return (
        <>
            <HierarchyPanel />
        </>
    );
}

export function SidePanel() {
    const { editingStage } = React.useContext(EditorContext);

    return (
        <div className="w-[calc(100%-16px)] h-[calc(100%-16px)] flex flex-col items-start shadow-even rounded-lg m-[8px] bg-white">
            {editingStage === EditingStage.Transform && <TransformSidePanel />}
            {editingStage === EditingStage.Annotate && <AnnotateSidePanel />}
        </div>
    );
}
