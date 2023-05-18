import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { GoSettings } from 'react-icons/go';
import { TiArrowMove } from 'react-icons/ti';

import { TabButton, TabPanel } from '@elements/Tabs';

import { ActionMenu } from './SidePanel/Actions';
import { ModelDetailPanel } from './SidePanel/Details/ModelDetail';
import { ModelMetaPanel } from './SidePanel/Meta/ModelMeta';
import { ModelList } from './SidePanel/ModelList';
import { ViewSettings } from './SidePanel/ViewSettings/ViewSettings';

export function SidePanel() {
    return (
        <div className="w-[calc(100%-16px)] h-[calc(100%-16px)] flex flex-col items-start shadow-even rounded-lg m-[8px] bg-white">
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
