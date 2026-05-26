import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {

  try {

    const { searchParams } =
      new URL(req.url)

    const orderId =
      searchParams.get("order_id")

    /*
    =====================================
    ORDER ID OBRIGATÓRIO
    =====================================
    */

    if (!orderId) {

      return NextResponse.json(
        {
          success: false,
          error:
            "order_id obrigatório",
        },
        {
          status: 400,
        }
      )

    }

    /*
    =====================================
    CONSULTAR PEDIDO
    =====================================
    */

    const { data, error } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq(
          "external_reference",
          orderId
        )
        .single()

    /*
    =====================================
    PEDIDO NÃO ENCONTRADO
    =====================================
    */

    if (error || !data) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Pedido não encontrado",
        },
        {
          status: 404,
        }
      )

    }

    /*
    =====================================
    RETORNO COMPLETO DO PEDIDO
    =====================================
    */

    return NextResponse.json({

      success: true,

      order: data,

    })

  } catch (error) {

    console.error(
      "Erro ao consultar pedido:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Erro interno",
      },
      {
        status: 500,
      }
    )

  }

}