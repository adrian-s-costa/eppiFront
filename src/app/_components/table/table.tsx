'use client'

import { Tabs, Table } from "flowbite-react";

export default function Tables ({ impressions, clicks, CTR }: any){
    return <Table className="flex-wrap mb-5">
    <Table.Head>
    <Table.HeadCell>Impressões</Table.HeadCell>
    <Table.HeadCell>Cliques</Table.HeadCell>
    <Table.HeadCell>CTR</Table.HeadCell>

    </Table.Head>
    <Table.Body className="divide-y flex-wrap">
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 flex-wrap">
        <Table.Cell className={`whitespace-nowrap font-medium ${impressions > 0 ? "text-green-500 dark:text-green-500" : "text-red-500 dark:text-red-500"}`}>
            {impressions}
        </Table.Cell>
        <Table.Cell className={`whitespace-nowrap font-medium ${clicks > 0 ? "text-green-500 dark:text-green-500" : "text-red-500 dark:text-red-500"}`}>
            {clicks}
        </Table.Cell>
        <Table.Cell className={`whitespace-nowrap font-medium ${CTR > 0 ? "text-green-500 dark:text-green-500" : "text-red-500 dark:text-red-500"}`}>
            {CTR}
        </Table.Cell>
    </Table.Row>
    </Table.Body>
  </Table>
}