package com.harvestmarkpti_poc.reactmodules;

import android.graphics.Bitmap;
import android.os.Looper;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.harvestmarkpti_poc.helperclasses.ZebraPrintUIHelper;
import com.zebra.sdk.comm.BluetoothConnection;
import com.zebra.sdk.comm.Connection;
import com.zebra.sdk.comm.ConnectionException;
import com.zebra.sdk.comm.TcpConnection;
import com.zebra.sdk.graphics.internal.ZebraImageAndroid;
import com.zebra.sdk.printer.PrinterStatus;
import com.zebra.sdk.printer.SGD;
import com.zebra.sdk.printer.ZebraPrinter;
import com.zebra.sdk.printer.ZebraPrinterFactory;
import com.zebra.sdk.printer.ZebraPrinterLanguageUnknownException;
import com.zebra.sdk.printer.ZebraPrinterLinkOs;

/**
 * Created by Kumar M on 08-Nov-17.
 */

public class ZebraPrint extends ReactContextBaseJavaModule
{
    private ReactApplicationContext mReactApplicationContext;
    private Connection connection;

    private ZebraPrintUIHelper helper;

    public ZebraPrint(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactApplicationContext = reactContext;
        helper = new ZebraPrintUIHelper(reactContext.getCurrentActivity());
    }

    @Override
    public String getName() {
        return "ZebraPrint";
    }

    @ReactMethod
    public synchronized void printLabel(boolean isBluetoothConnection, String macAddress, String ipAddress, String portNumber) {
        LabelViewManager mLabelViewManager = LabelViewManager.GET_INSTANCE(mReactApplicationContext);
        printPhotoFromExternal(mLabelViewManager.getLabelBitmap(), isBluetoothConnection, macAddress, ipAddress, portNumber);
    }

    /**
     * This method makes the call to the printer and send the images to the printer to print.
     * @param bitmap
     */
    private void printPhotoFromExternal(final Bitmap bitmap, final boolean isBluetoothConnection, final String macAddress, final String ipAddress, final String portNumber) {

        new Thread(new Runnable() {
            public void run() {

                try {
                    Looper.prepare();
                    connection = getZebraPrinterConn(isBluetoothConnection, macAddress, ipAddress, portNumber);
                    connection.open();
                    ZebraPrinter printer = getPrinterStatus();
                    ZebraPrinterLinkOs linkOsPrinter = ZebraPrinterFactory.createLinkOsPrinter(printer);
                    PrinterStatus printerStatus = (linkOsPrinter != null) ? linkOsPrinter.getCurrentStatus() : printer.getCurrentStatus();
                    /**
                     * Best practices implementation to check the status of the printer is if ready or not and then send the image to print
                     */

                    if (printerStatus.isReadyToPrint) {
                        try {
                            helper.showLoadingDialog("Printer Ready \nProcessing to print");
                            printer.printImage(new ZebraImageAndroid(bitmap), 0, 0, /*bitmap.getWidth()*/700, /*bitmap.getHeight()*/550, false);
                        } catch (ConnectionException e) {
                            helper.showErrorDialogOnGuiThread(e.getMessage());
                        }
                    } else if (printerStatus.isHeadOpen) {
                        helper.showErrorMessage("Error: Head Open \nPlease Close Printer Head to Print.");
                    } else if (printerStatus.isPaused) {
                        helper.showErrorMessage("Error: Printer Paused");
                    } else if (printerStatus.isPaperOut) {
                        helper.showErrorMessage("Error: Media Out \nPlease Load Media to Print.");
                    } else {
                        helper.showErrorMessage("Error: Please check the Connection of the Printer.");
                    }

                    connection.close();

                } catch (ConnectionException e) {
                    helper.showErrorDialogOnGuiThread(e.getMessage());
                } catch (ZebraPrinterLanguageUnknownException e) {
                    helper.showErrorDialogOnGuiThread(e.getMessage());
                } finally {
                    bitmap.recycle();
                    helper.dismissLoadingDialog();
                    Looper.myLooper().quit();

                }
            }

        }).start();

    }

    /**
     * This method checks the mode of connection.
     * @return
     */
    private Connection getZebraPrinterConn(boolean isBluetoothConnection, String macAddress, String ipAddress, String port) {
        int portNumber;
        try {
            portNumber = Integer.parseInt(port);
        } catch (NumberFormatException e) {
            portNumber = 0;
        }
        return isBluetoothConnection ? new BluetoothConnection(macAddress) : new TcpConnection(ipAddress, portNumber);
    }

    /**
     * This method implements best practices to check the language of the printer and set the language of the printer to ZPL.
     * @return printer
     * @throws ConnectionException
     * @throws ZebraPrinterLanguageUnknownException
     */
    private ZebraPrinter getPrinterStatus() throws ConnectionException, ZebraPrinterLanguageUnknownException {

        ZebraPrinter printer = ZebraPrinterFactory.getInstance(connection);

        final String printerLanguage = SGD.GET("device.languages", connection);

        final String displayPrinterLanguage = "Printer Language is " + printerLanguage;

        SGD.SET("device.languages", "hybrid_xml_zpl", connection);

        mReactApplicationContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {

                Toast.makeText(mReactApplicationContext, displayPrinterLanguage + "\n" + "Language set to ZPL", Toast.LENGTH_LONG).show();

            }
        });
        return printer;
    }

}
