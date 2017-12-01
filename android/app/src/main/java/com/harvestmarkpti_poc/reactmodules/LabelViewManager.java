package com.harvestmarkpti_poc.reactmodules;

import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.datamatrix.DataMatrixWriter;
import com.google.zxing.datamatrix.encoder.SymbolShapeHint;
import com.harvestmarkpti_poc.R;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;

/**
 * Created by Kumar M on 30-Nov-17.
 */

public class LabelViewManager  extends ReactContextBaseJavaModule
{
    private static LabelViewManager mInstance;
    private View mLabelView;


    private LabelViewManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName()
    {
        return "LabelViewManager";
    }

    public synchronized static LabelViewManager GET_INSTANCE(ReactApplicationContext context) {
        if (mInstance == null)
            mInstance = new LabelViewManager(context);

        return mInstance;
    }

    private synchronized View getLabelView(){
        if (mLabelView == null)
            mLabelView = LayoutInflater.from(getReactApplicationContext()).inflate(R.layout.label_preview, null);

        return mLabelView;
    }

    public Bitmap getLabelBitmap() {
        View view = getLabelView();
        view.setDrawingCacheEnabled(true);
        // Without it the view will have a dimension of 0,0 and the bitmap will be null
        view.measure(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED), View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
        view.layout(0, 0, view.getMeasuredWidth(), view.getMeasuredHeight());
        view.buildDrawingCache(true);
        Bitmap bitmap = Bitmap.createBitmap(view.getDrawingCache());
        view.setDrawingCacheEnabled(false); // clear drawing cache
        return bitmap;
    }

    public void getLabelBase64(Callback callback) {
        Bitmap bitmap = getLabelBitmap();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream .toByteArray();
        String encodedBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
        callback.invoke(encodedBase64);
    }

    @ReactMethod
    public void setLabelValues(ReadableMap labelValues, Callback callback) {

        System.out.println("labelValues "+labelValues);

        if (labelValues == null){
            return;
        }

        if(labelValues.hasKey("barcodevalue")){
            ImageView mIvBarCode = (ImageView)getLabelView().findViewById(R.id.xIvBarcode);
            mIvBarCode.setImageBitmap(getCODE128BarcodeBitmap(labelValues.getString("barcodevalue"), 400, 50));
        }

        if(labelValues.hasKey("GTINNumberLbl")){
            ((TextView)getLabelView().findViewById(R.id.xTvGTINNumber)).setText(labelValues.getString("GTINNumberLbl"));
        }

        if(labelValues.hasKey("lotNumberLbl")){
            ((TextView)getLabelView().findViewById(R.id.xTvLotNumber)).setText(labelValues.getString("lotNumberLbl"));
        }

        if(labelValues.hasKey("commodity")){
            ((TextView)getLabelView().findViewById(R.id.xTvCommodity)).setText(labelValues.getString("commodity"));
        }

        if(labelValues.hasKey("variety")){
            ((TextView)getLabelView().findViewById(R.id.xTvVariety)).setText(labelValues.getString("variety"));
        }

        if(labelValues.hasKey("packLine7")){
            ((TextView)getLabelView().findViewById(R.id.xTvPackLine)).setText(labelValues.getString("packLine7"));
        }

        if(labelValues.hasKey("dateType")){
            String dateType = labelValues.getString("dateType");

            TextView mTvDateType = (TextView)getLabelView().findViewById(R.id.xTvDateType);
            mTvDateType.setText(dateType);

            int visibility = (dateType).equalsIgnoreCase("None") ? View.INVISIBLE :  View.VISIBLE;
            mTvDateType.setVisibility(visibility);
            getLabelView().findViewById(R.id.xTvDate).setVisibility(visibility);
        }

        if(labelValues.hasKey("countryOfOrigin")){
            ((TextView)getLabelView().findViewById(R.id.xTvCountryOfOrigin)).setText(getReactApplicationContext().getString(R.string.produce_of) +" "+ labelValues.getString("countryOfOrigin"));
        }

        if(labelValues.hasKey("grade")){
            ((TextView)getLabelView().findViewById(R.id.xTvGrade)).setText(labelValues.getString("grade"));
        }

        if(labelValues.hasKey("date")){
            ((TextView)getLabelView().findViewById(R.id.xTvDate)).setText(labelValues.getString("date"));
        }

        ImageView mIvDataMatrixCode = (ImageView) getLabelView().findViewById(R.id.xIvDataMatrixCode);
        if (mIvDataMatrixCode.getDrawable() == null){
            mIvDataMatrixCode.setImageBitmap(getDataMatrixBarcode("123412341234HM01", 100, 100));
        }

        getLabelBase64(callback);
    }

    private Bitmap getCODE128BarcodeBitmap(String barcodeValue, int width, int height) {
        Bitmap barcodeBitmap = null;

        try {
            MultiFormatWriter mMultiFormatWriter = new MultiFormatWriter();
            String encodedBarcodeValue = Uri.encode(barcodeValue, "utf-8");
            // Use 1 as the height of the matrix as this is a 1D Barcode.
            BitMatrix bm = mMultiFormatWriter.encode(encodedBarcodeValue, BarcodeFormat.CODE_128, width, 1);
            int bmWidth = bm.getWidth();
            barcodeBitmap = Bitmap.createBitmap(bmWidth, height, Bitmap.Config.ARGB_8888);

            for (int i = 0; i < bmWidth; i++) {
                // Paint columns of width 1
                int[] column = new int[height];
                Arrays.fill(column, bm.get(i, 0) ? Color.BLACK : Color.WHITE);
                barcodeBitmap.setPixels(column, 0, 1, i, 0, 1, height);
            }
        } catch (WriterException e) {
            e.printStackTrace();
        }

        return barcodeBitmap;
    }

    private Bitmap getDataMatrixBarcode(String dataMatrixValue, int requestedWidth, int requestedHeight) {
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
        Bitmap dataMatrixBitmap = Bitmap.createBitmap(requestedWidth, requestedHeight, Bitmap.Config.ARGB_8888);
        dataMatrixBitmap.setPixels(pixels, 0, requestedWidth, 0, 0, requestedWidth, requestedHeight);

        return dataMatrixBitmap;
    }

}
