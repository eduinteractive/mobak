import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { manipulateAsync } from "expo-image-manipulator";

export const convertImageToBase64 = async (image: number) => {
    try {
        // Lade das Bild-Asset und stelle sicher, dass es lokal verfügbar ist
        const asset = Asset.fromModule(image);
        await asset.downloadAsync();

        const result = await ImageManipulator.manipulateAsync(asset.localUri || "", [{ resize: { width: 300, height: 300 } }], {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
        });

        // Lies das Bild als Base64
        const base64 = await FileSystem.readAsStringAsync(result.uri || asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error("Fehler beim Konvertieren des Bildes in Base64:", error);
        throw error;
    }
};

export const PDF_TESTRESULT = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testresults</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 40px;
            background-color: #f9f9f9;
            color: #333;
        }
        h1, h2, h3 {
            text-align: center;
            margin: 10px 0;
        }
        h1 {
            font-size: 28px;
        }
        h2 {
            font-size: 22px;
        }
        h3 {
            font-size: 18px;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        th, td {
            border: 1px solid #ddd;
            text-align: center;
            padding: 10px;
        }
        th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #ddd;
        }
        .summary {
            margin: 20px 0;
            font-size: 16px;
            text-align: center;
        }
        p {
            line-height: 1.6;
            margin: 20px 0;
            text-align: justify;
        }
        ol {
            margin: 20px 0;
            padding-left: 40px;
        }
        ol li {
            margin-bottom: 10px;
        }
        footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <h1>%%TEST_CLASS%%</h1>
    <h2>MOBAK %%rate_detail_valuation%%</h2>
    <h3>%%TEST_DATE%%</h3>
    <table>
        <thead>
            <tr>
                <th>Id</th>
                <th>%%student_textfield_gender%%</th>
                <th>%%student_textfield_name%%</th>
                <th>%%task_balancing%%</th>
                <th>%%task_rolling%%</th>
                <th>%%task_jumping%%</th>
                <th>%%task_running%%</th>
                <th>%%task_self_movement%%</th>
                <th>%%task_bouncing%%</th>
                <th>%%task_catching%%</th>
                <th>%%task_throwing%%</th>
                <th>%%task_dribbling%%</th>
                <th>%%task_object_movement%%</th>
            </tr>
        </thead>
        <tbody>
            <!-- Dynamisch generierte Zeilen für Schüler -->
            %%STUDENT_ROWS%%
            %%AVERAGE_ROWS%%
        </tbody>
    </table>
    <p>%%INSTRUCTION%%</p>
    <ol>
        <li>%%INSTRUCTION_1%%</li>
        <li>%%INSTRUCTION_2%%</li>
        <li>%%INSTRUCTION_3%%</li>
        <li>%%INSTRUCTION_4%%</li>
    </ol>
    <p>%%INSTRUCTION_END%%</p>
</body>
</html>
`;

export const PDF_TASK = `
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Learning Task</title>
        <style>
        @page {
            margin: 10mm 5mm; /* Top-Margin für alle Seiten */
        }
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
        }
        h1, h2, h3 {
            text-align: center;
        }
        h1 {
            font-size: 28px;
            color: #4CAF50;
        }
        h3 {
            font-size: 20px;
            margin-bottom: 15px;
            color: #4CAF50;
        }
        .image-container {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .section {
            margin-bottom: 25px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            page-break-inside: avoid; /* Verhindert, dass Sektionen zwischen Seiten geteilt werden */
        }
        .section h4 {
            margin-top: 0;
            margin-bottom: 5px;
            color: #4CAF50;
            font-size: 18px;
        }
        .accordion-content {
            font-size: 14px;
            color: #555;
            max-width: 100%;
            white-space: pre-wrap; /* Bricht lange Texte um */
            overflow-wrap: break-word; /* Bricht lange Wörter */
        }
        footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #777;
        }
    </style>
    </head>
    <body>
        %%BODY%%
    </body>
</html>`;

export const PDF_PASS = `
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Learning Pass</title>
        <style>
            @page {
                margin: 10mm 10mm; /* Top-Margin für alle Seiten */
            }
            body {
                font-family: Arial, sans-serif;
                padding: 0;
                color: #333;
            }
            h1, h2, h3 {
            }
            h1 {
                font-size: 28px;
                margin-bottom: 10;
                border-bottom: 2px solid #4CAF50;
            }
            h2 {
                font-size: 22px;
            }
            h3 {
                font-size: 18px;
                color: #555;
            }
            h4 {
                margin-bottom: 2.5px;
                font-size: 16px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            th, td {
                border: 1px solid #ddd;
                padding: 10px;
            }
            th {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>%%PASS_TITLE%%</h1>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>%%REACHING_GOAL%%</th>
                    <th>%%MY_IDEA%%</th>
                </tr>
            </thead>
            <tbody>
                <!-- Dynamisch generierte Zeilen für Schüler -->
                %%PASS_ROWS%%
            </tbody>
        </table>
    </body>
</html>`;
