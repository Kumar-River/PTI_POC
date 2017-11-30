package com.harvestmarkpti_poc.reactmodules;

import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.util.Base64;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.datamatrix.DataMatrixWriter;
import com.google.zxing.datamatrix.encoder.SymbolShapeHint;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;


/**
 * Created by Kumar M on 28-Nov-17.
 */

public class RNZXing extends ReactContextBaseJavaModule
{
    private ReactApplicationContext mReactApplicationContext;

    public RNZXing(ReactApplicationContext reactContext)
    {
        super(reactContext);

        mReactApplicationContext = reactContext;
    }

    @Override
    public String getName()
    {
        return "RNZXing";
    }

    @ReactMethod
    public synchronized void generateCODE128Barcode(String code128Value, int width, int height, Callback base64Callback) {
        try {
            MultiFormatWriter mMultiFormatWriter = new MultiFormatWriter();
            String dataValue = Uri.encode(code128Value, "utf-8");
            // Use 1 as the height of the matrix as this is a 1D Barcode.
            BitMatrix bm = mMultiFormatWriter.encode(dataValue, BarcodeFormat.CODE_128, width, 1);
            int bmWidth = bm.getWidth();
            Bitmap barcodeBitmap = Bitmap.createBitmap(bmWidth, height, Bitmap.Config.ARGB_8888);

            for (int i = 0; i < bmWidth; i++) {
                // Paint columns of width 1
                int[] column = new int[height];
                Arrays.fill(column, bm.get(i, 0) ? Color.BLACK : Color.WHITE);
                barcodeBitmap.setPixels(column, 0, 1, i, 0, 1, height);
            }

            ByteArrayOutputStream bao = new ByteArrayOutputStream();
            barcodeBitmap.compress(Bitmap.CompressFormat.JPEG, 100, bao);
            byte [] ba = bao.toByteArray();
            String ba1= Base64.encodeToString(ba,Base64.DEFAULT);

            base64Callback.invoke(ba1);
        } catch (WriterException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public synchronized void generateDataMatrixBarcode(String dataMatrixValue, int requestedWidth, int requestedHeight, Callback base64Callback) {
        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.DATA_MATRIX_SHAPE, SymbolShapeHint.FORCE_SQUARE);

        int bigEnough = 64;
        DataMatrixWriter writer = new DataMatrixWriter();
        BitMatrix bitMatrix = writer.encode(dataMatrixValue, BarcodeFormat.DATA_MATRIX, bigEnough, bigEnough, hints);

        int width = bitMatrix.getWidth();
        int height = bitMatrix.getHeight();

        // calculating the scaling factor
        int pixelsize = requestedWidth/width;
        if (pixelsize > requestedHeight/height) {
            pixelsize = requestedHeight/height;
        }

        int[] pixels = new int[requestedWidth * requestedHeight];
        // All are 0, or black, by default
        for (int y = 0; y < height; y++) {
            int offset = y * requestedWidth * pixelsize;
            // scaling pixel height
            for (int pixelsizeHeight = 0; pixelsizeHeight < pixelsize; pixelsizeHeight++, offset+=requestedWidth) {
                for (int x = 0; x < width; x++) {
                    int color = bitMatrix.get(x, y) ? Color.BLACK : Color.WHITE;
                    // scaling pixel width
                    for (int pixelsizeWidth = 0; pixelsizeWidth < pixelsize; pixelsizeWidth++) {
                        pixels[offset + x * pixelsize + pixelsizeWidth] = color;
                    }
                }
            }
        }
        Bitmap bitmap = Bitmap.createBitmap(requestedWidth, requestedHeight, Bitmap.Config.ARGB_8888);
        bitmap.setPixels(pixels, 0, requestedWidth, 0, 0, requestedWidth, requestedHeight);

        ByteArrayOutputStream bao = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, bao);
        byte [] ba = bao.toByteArray();
        String ba1= Base64.encodeToString(ba,Base64.DEFAULT);

        base64Callback.invoke(ba1);
    }
}
