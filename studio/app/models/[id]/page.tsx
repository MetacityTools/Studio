"use client";

import {
  ActionButton,
  Button,
  Flex,
  Item,
  ListView,
  Text,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ContentContainer } from "@core/components/ContentContainer";
import { NoData } from "@core/components/Empty";
import Header from "@features/projects/components/Header";
import { useOwnModels } from "@features/models/hooks/useOwnModels";
import File from "@spectrum-icons/illustrations/File";
import Link from "next/link";
import { useOwnModel } from "@features/models/hooks/useOwnModel";

function ModelDetailPage({ params }: { params: { id: string } }) {
    const { data: model, isLoading } = useOwnModel(Number(params.id));
    return <h1>My Model {model?.name}</h1>
  }

export default withPageAuthRequired(ModelDetailPage);
