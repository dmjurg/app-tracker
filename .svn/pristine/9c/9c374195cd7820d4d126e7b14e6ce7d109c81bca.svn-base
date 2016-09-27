package com.c20g.appportal.projtrac;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Utilities {

    public static String calculateNextFriday() {
        Calendar today = Calendar.getInstance();
        int dayOfWeek = today.get(Calendar.DAY_OF_WEEK);
        int daysUntilNextFriday = Calendar.FRIDAY - dayOfWeek;
        if(daysUntilNextFriday < 0){
            daysUntilNextFriday = daysUntilNextFriday + 7;
        }
        Calendar nextFriday = (Calendar)today.clone();
        nextFriday.add(Calendar.DAY_OF_WEEK, daysUntilNextFriday);

        return new SimpleDateFormat("yyyy-MM-dd").format(nextFriday.getTime());
    }

}